-- Allow public registration (insert) for all roles
CREATE POLICY "Allow public insert for clients" ON public.kfs_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for customers" ON public.kfs_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for promotoras" ON public.kfs_promotoras FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for riders" ON public.kfs_riders FOR INSERT WITH CHECK (true);

-- Allow public read access for all required roles to log in
CREATE POLICY "Allow public select for clients" ON public.kfs_clients FOR SELECT USING (true);
CREATE POLICY "Allow public select for customers" ON public.kfs_customers FOR SELECT USING (true);
CREATE POLICY "Allow public select for promotoras" ON public.kfs_promotoras FOR SELECT USING (true);
CREATE POLICY "Allow public select for riders" ON public.kfs_riders FOR SELECT USING (true);

-- Allow public updates for own records (simplified for now to allow local state sync)
CREATE POLICY "Allow public update for clients" ON public.kfs_clients FOR UPDATE USING (true);
CREATE POLICY "Allow public update for customers" ON public.kfs_customers FOR UPDATE USING (true);
CREATE POLICY "Allow public update for promotoras" ON public.kfs_promotoras FOR UPDATE USING (true);
CREATE POLICY "Allow public update for riders" ON public.kfs_riders FOR UPDATE USING (true);
