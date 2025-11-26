"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: 'http://localhost:3000',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        });
        await app.listen(3001);
        console.log('Application is running on: http://localhost:3001');
    }
    catch (error) {
        console.error('Error starting application:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map