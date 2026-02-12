"use client";

import { createClient } from "@/lib/supabase/client";
import { Persona, PersonaInsert, PersonaUpdate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const supabase = createClient();

// Fetch all personas
export function usePersonas(search?: string, tagFilter?: string) {
  return useQuery<Persona[]>({
    queryKey: ["personas", search, tagFilter],
    queryFn: async () => {
      let query = supabase
        .from("personas")
        .select("*")
        .order("updated_at", { ascending: false });

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      if (tagFilter) {
        query = query.contains("tags", [tagFilter]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Persona[];
    },
  });
}

// Fetch a single persona by id
export function usePersona(id: string) {
  return useQuery<Persona>({
    queryKey: ["persona", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Persona;
    },
    enabled: !!id,
  });
}

// Create a new persona
export function useCreatePersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (persona: PersonaInsert) => {
      const { data, error } = await supabase
        .from("personas")
        .insert(persona)
        .select()
        .single();
      if (error) throw error;
      return data as Persona;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
    },
  });
}

// Update a persona
export function useUpdatePersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: PersonaUpdate;
    }) => {
      const { data, error } = await supabase
        .from("personas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Persona;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      queryClient.invalidateQueries({ queryKey: ["persona", data.id] });
    },
  });
}

// Delete a persona
export function useDeletePersona() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("personas")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
    },
  });
}
