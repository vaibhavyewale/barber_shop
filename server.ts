import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

// In-memory mock database fallback
const db = {
  appointments: [] as any[],
  services: [],
  users: [],
};

// Initialize Supabase if keys are present
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // API Routes
  const apiRouter = express.Router();

  apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', message: `Backend is running (${supabase ? 'Supabase mode' : 'In-memory mode'})` });
  });

  apiRouter.get('/appointments', async (req, res) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
      }
    } else {
      res.json(db.appointments);
    }
  });

  apiRouter.post('/appointments', async (req, res) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert([{ ...req.body, status: 'pending' }])
          .select()
          .single();
        if (error) throw error;
        res.status(201).json(data);
      } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ error: 'Failed to create appointment' });
      }
    } else {
      const newAppointment = { id: Date.now().toString(), ...req.body, status: 'pending' };
      db.appointments.push(newAppointment);
      res.status(201).json(newAppointment);
    }
  });

  // Admin summary stats
  apiRouter.get('/admin/stats', async (req, res) => {
    let appointmentCount = db.appointments.length;
    let barberCount = 0;
    
    if (supabase) {
      try {
        const { count, error } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
        if (!error && count !== null) appointmentCount = count;
        
        const { count: bCount, error: bError } = await supabase.from('barbers').select('*', { count: 'exact', head: true });
        if (!bError && bCount !== null) barberCount = bCount;
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }

    res.json({
      revenue: '$12,450',
      appointments: appointmentCount,
      customers: 420,
      activeBarbers: barberCount || 5
    });
  });

  // Generic CRUD for a given table
  const addCrudRoutes = (tableName: string) => {
    apiRouter.get(`/${tableName}`, async (req, res) => {
      if (supabase) {
        try {
          const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
          if (error) throw error;
          res.json(data);
        } catch (err) {
          res.status(500).json({ error: `Failed to fetch ${tableName}` });
        }
      } else {
        res.json((db as any)[tableName] || []);
      }
    });

    apiRouter.post(`/${tableName}`, async (req, res) => {
      if (supabase) {
        try {
          const { data, error } = await supabase.from(tableName).insert([req.body]).select().single();
          if (error) throw error;
          res.status(201).json(data);
        } catch (err: any) {
          console.error(`Error in ${tableName} POST:`, err);
          res.status(500).json({ error: `Failed to create ${tableName}`, details: err.message || err });
        }
      } else {
        const newItem = { id: Date.now().toString(), ...req.body };
        if (!(db as any)[tableName]) (db as any)[tableName] = [];
        (db as any)[tableName].push(newItem);
        res.status(201).json(newItem);
      }
    });

    apiRouter.put(`/${tableName}/:id`, async (req, res) => {
      if (supabase) {
        try {
          const { data, error } = await supabase.from(tableName).update(req.body).eq('id', req.params.id).select().single();
          if (error) throw error;
          res.status(200).json(data);
        } catch (err: any) {
          console.error(`Error in ${tableName} PUT:`, err);
          res.status(500).json({ error: `Failed to update ${tableName}`, details: err.message || err });
        }
      } else {
        if ((db as any)[tableName]) {
          const index = (db as any)[tableName].findIndex((i: any) => i.id === req.params.id);
          if (index !== -1) {
            (db as any)[tableName][index] = { ...(db as any)[tableName][index], ...req.body };
            res.status(200).json((db as any)[tableName][index]);
            return;
          }
        }
        res.status(404).json({ error: 'Not found' });
      }
    });

    apiRouter.delete(`/${tableName}/:id`, async (req, res) => {
      if (supabase) {
        try {
          const { error } = await supabase.from(tableName).delete().eq('id', req.params.id);
          if (error) throw error;
          res.status(200).json({ success: true });
        } catch (err: any) {
          console.error(`Error in ${tableName} DELETE:`, err);
          res.status(500).json({ error: `Failed to delete ${tableName}`, details: err.message || err });
        }
      } else {
        if ((db as any)[tableName]) {
          (db as any)[tableName] = (db as any)[tableName].filter((i: any) => i.id !== req.params.id);
        }
        res.status(200).json({ success: true });
      }
    });
  };

  addCrudRoutes('barbers');
  addCrudRoutes('services');
  addCrudRoutes('products');
  addCrudRoutes('gallery');
  addCrudRoutes('testimonials');
  addCrudRoutes('blogs');
  addCrudRoutes('users');
  addCrudRoutes('settings');
  addCrudRoutes('contacts');

  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
