export const formatDateToDefaultBR = (day: string | null | undefined) => {
  if (!day) {
    return "Data não disponível";
  }

  try {
    const [year, month, dayOfMonth] = day.split("T")[0]!.split("-");
    return `${dayOfMonth}/${month}/${year}`;
  } catch (error) {
    return "Erro ao formatar data";
  }
};
