call npm install @prisma/client class-validator class-transformer @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/event-emitter
call npm install prisma @types/passport-jwt @types/bcrypt --save-dev
call npx prisma generate
call npx nest generate module prisma --no-spec
call npx nest generate service prisma --no-spec
call npx nest generate module auth --no-spec
call npx nest generate service auth --no-spec
call npx nest generate controller auth --no-spec
call npx nest generate module admin --no-spec
call npx nest generate module environmental --no-spec
call npx nest generate module social --no-spec
call npx nest generate module governance --no-spec
call npx nest generate module gamification --no-spec
