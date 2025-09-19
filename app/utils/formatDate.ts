// ========== UTILS/DATE.TS - APENAS FORMATAÇÃO ==========
// ✅ Responsabilidades das utils:
// - formatTime()         → "10:13"
// - formatDateTime()     → "19/09/2025 10:13"
// - formatDateChip()     → "Hoje", "Ontem", "15 de setembro"
// - formatChatTime()     → Para lista de chats

export const formatTime = (timestamp: string | Date): string => {
  return new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateTime = (timestamp: string | Date): string => {
  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateChip = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Hoje
  if (date.toDateString() === today.toDateString()) {
    return "Hoje";
  }

  // Ontem
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ontem";
  }

  // Esta semana
  const daysDifference = Math.ceil(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDifference <= 7) {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long", // "segunda-feira"
    });
  }

  // Este ano
  if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long", // "15 de setembro"
    });
  }

  // Ano diferente
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric", // "15 de setembro de 2023"
  });
};

export const formatChatTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Se for hoje, mostra apenas a hora
  if (date.toDateString() === now.toDateString()) {
    return `Hoje ${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Se for ontem
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ontem ${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Mais antigo: data completa
  return date.toLocaleDateString("pt-BR");
};
