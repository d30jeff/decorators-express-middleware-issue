import { createApplication } from "@/providers/application.provider.js";
import { CatController } from "@/servers/admin/cat/cat.controller.js";

async function main() {
  const { app } = await createApplication({
    name: "Admin",
    controllers: [CatController],
    origin: [],
  });

  app.listen(3000, async () => {
    console.info("Admin API is listening on port 3000");
  });
}

main();
