export const getErrorMessageApi = (error: any) => {
  const errorMessage =
    (error?.status || error?.statusCode) && error?.message
      ? `${error?.status || error?.statusCode} - ${error?.message}`
      : error?.message || "Erro desconhecido";

  return errorMessage;
};
