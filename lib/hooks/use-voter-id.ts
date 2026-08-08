"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rmp_voter_id";

function generateId() {
  return crypto.randomUUID();
}

export function useVoterId() {
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    setVoterId(id);
  }, []);

  return voterId;
}