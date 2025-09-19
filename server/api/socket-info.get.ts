export default defineEventHandler(async (event) => {
  return {
    message: "Socket.IO server running on Nitro",
    timestamp: new Date().toISOString(),
    status: "active",
  };
});
