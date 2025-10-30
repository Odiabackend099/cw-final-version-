-- Create knowledge_base_files table for agent training documents
CREATE TABLE IF NOT EXISTS public.knowledge_base_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id UUID NOT NULL REFERENCES public.assistants(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  processed BOOLEAN DEFAULT false,
  embeddings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on assistant_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_knowledge_base_files_assistant_id
  ON public.knowledge_base_files(assistant_id);

-- Create index on processed for batch processing
CREATE INDEX IF NOT EXISTS idx_knowledge_base_files_processed
  ON public.knowledge_base_files(processed);

-- Enable RLS
ALTER TABLE public.knowledge_base_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own assistant's files
CREATE POLICY "Users can manage their own knowledge base files"
  ON public.knowledge_base_files
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.assistants
      WHERE assistants.id = knowledge_base_files.assistant_id
      AND assistants.user_id = auth.uid()
    )
  );

-- Policy: Service role can do everything
CREATE POLICY "Service role can manage all knowledge base files"
  ON public.knowledge_base_files
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_knowledge_base_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_knowledge_base_files_updated_at ON public.knowledge_base_files;
CREATE TRIGGER set_knowledge_base_files_updated_at
  BEFORE UPDATE ON public.knowledge_base_files
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_base_files_updated_at();

-- Create storage bucket for knowledge base files
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-base', 'knowledge-base', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for knowledge base bucket
CREATE POLICY "Users can upload to their own assistant folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'knowledge-base'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read their own assistant files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'knowledge-base'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own assistant files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'knowledge-base'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_base_files TO authenticated;
GRANT ALL ON public.knowledge_base_files TO service_role;

COMMENT ON TABLE public.knowledge_base_files IS 'Knowledge base documents for AI agent training';
COMMENT ON COLUMN public.knowledge_base_files.processed IS 'Whether the file has been processed and embedded';
COMMENT ON COLUMN public.knowledge_base_files.embeddings IS 'Vector embeddings for semantic search (future feature)';
