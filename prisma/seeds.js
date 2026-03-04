
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cargando los datos...');

  // ─── 1. Crear Permisos ──────────────────────────────────────────────────────
  console.log('Creando permisos...');

  const permisos = [
    // Permisos de perfil propio
    { accion: 'ver_mi_perfil', descripcion: 'Ver mi propio perfil', modulo: 'perfil' },
    { accion: 'editar_mi_perfil', descripcion: 'Editar mi propio perfil', modulo: 'perfil' },

    // Permisos de pacientes
    { accion: 'ver_pacientes', descripcion: 'Ver lista de todos los pacientes', modulo: 'pacientes' },
    { accion: 'ver_paciente', descripcion: 'Ver detalle de un paciente', modulo: 'pacientes' },
    { accion: 'crear_paciente', descripcion: 'Crear nuevo paciente', modulo: 'pacientes' },
    { accion: 'editar_paciente', descripcion: 'Editar datos de un paciente', modulo: 'pacientes' },
    { accion: 'eliminar_paciente', descripcion: 'Eliminar un paciente', modulo: 'pacientes' },
    { accion: 'buscar_pacientes', descripcion: 'Buscar pacientes por criterios', modulo: 'pacientes' },

    // Permisos de QR
    { accion: 'generar_qr', descripcion: 'Generar código QR', modulo: 'qr' },
    { accion: 'escanear_qr', descripcion: 'Escanear código QR', modulo: 'qr' },

    // Permisos de usuarios
    { accion: 'ver_usuarios', descripcion: 'Ver lista de usuarios', modulo: 'usuarios' },
    { accion: 'crear_usuario', descripcion: 'Crear nuevo usuario', modulo: 'usuarios' },
    { accion: 'editar_usuario', descripcion: 'Editar datos de un usuario', modulo: 'usuarios' },
    { accion: 'eliminar_usuario', descripcion: 'Eliminar un usuario', modulo: 'usuarios' },
    { accion: 'gestionar_roles', descripcion: 'Asignar/modificar roles', modulo: 'usuarios' },

    // Permisos de sistema
    { accion: 'ver_estadisticas', descripcion: 'Ver estadísticas del sistema', modulo: 'sistema' },
    { accion: 'gestionar_permisos', descripcion: 'Gestionar permisos y roles', modulo: 'sistema' },
  ];

  for (const permiso of permisos) {
    await prisma.permission.upsert({
      where: { accion: permiso.accion },
      update: {},
      create: permiso,
    });
  }

  console.log(`✅ ${permisos.length} permisos creados/actualizados`);

  // ─── 2. Obtener IDs de permisos ─────────────────────────────────────────────
  const getPermissionId = async (accion) => {
    const p = await prisma.permission.findUnique({ where: { accion } });
    return p.id;
  };

  // ─── 3. Crear Roles ─────────────────────────────────────────────────────────
  console.log('Creando roles...');

  // ROL: PACIENTE
  const rolPaciente = await prisma.role.upsert({
    where: { nombre: 'PACIENTE' },
    update: {},
    create: {
      nombre: 'PACIENTE',
      descripcion: 'Paciente del sistema. Puede ver y editar su propio pasaporte médico.',
    },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: rolPaciente.id } });
  await prisma.rolePermission.createMany({
    data: [
      { roleId: rolPaciente.id, permissionId: await getPermissionId('ver_mi_perfil') },
      { roleId: rolPaciente.id, permissionId: await getPermissionId('editar_mi_perfil') },
      { roleId: rolPaciente.id, permissionId: await getPermissionId('generar_qr') },
    ],
    skipDuplicates: true,
  });

  // ROL: ACOMPAÑANTE
  const rolAcompanante = await prisma.role.upsert({
    where: { nombre: 'ACOMPAÑANTE' },
    update: {},
    create: {
      nombre: 'ACOMPAÑANTE',
      descripcion: 'Acompañante o tutor de un paciente. Puede ver y editar el perfil del paciente asociado.',
    },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: rolAcompanante.id } });
  await prisma.rolePermission.createMany({
    data: [
      { roleId: rolAcompanante.id, permissionId: await getPermissionId('ver_mi_perfil') },
      { roleId: rolAcompanante.id, permissionId: await getPermissionId('editar_mi_perfil') },
      { roleId: rolAcompanante.id, permissionId: await getPermissionId('ver_paciente') },
      { roleId: rolAcompanante.id, permissionId: await getPermissionId('editar_paciente') },
      { roleId: rolAcompanante.id, permissionId: await getPermissionId('generar_qr') },
    ],
    skipDuplicates: true,
  });

  // ROL: MEDICO
  const rolMedico = await prisma.role.upsert({
    where: { nombre: 'MEDICO' },
    update: {},
    create: {
      nombre: 'MEDICO',
      descripcion: 'Médico profesional. Puede ver todos los pacientes y buscar por criterios.',
    },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: rolMedico.id } });
  await prisma.rolePermission.createMany({
    data: [
      { roleId: rolMedico.id, permissionId: await getPermissionId('ver_mi_perfil') },
      { roleId: rolMedico.id, permissionId: await getPermissionId('editar_mi_perfil') },
      { roleId: rolMedico.id, permissionId: await getPermissionId('ver_pacientes') },
      { roleId: rolMedico.id, permissionId: await getPermissionId('ver_paciente') },
      { roleId: rolMedico.id, permissionId: await getPermissionId('buscar_pacientes') },
      { roleId: rolMedico.id, permissionId: await getPermissionId('escanear_qr') },
    ],
    skipDuplicates: true,
  });

  // ROL: ENFERMERO
  const rolEnfermero = await prisma.role.upsert({
    where: { nombre: 'ENFERMERO' },
    update: {},
    create: {
      nombre: 'ENFERMERO',
      descripcion: 'Enfermero del sistema. Puede ver pacientes y asistir en el cuidado.',
    },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: rolEnfermero.id } });
  await prisma.rolePermission.createMany({
    data: [
      { roleId: rolEnfermero.id, permissionId: await getPermissionId('ver_mi_perfil') },
      { roleId: rolEnfermero.id, permissionId: await getPermissionId('editar_mi_perfil') },
      { roleId: rolEnfermero.id, permissionId: await getPermissionId('ver_pacientes') },
      { roleId: rolEnfermero.id, permissionId: await getPermissionId('ver_paciente') },
      { roleId: rolEnfermero.id, permissionId: await getPermissionId('buscar_pacientes') },
    ],
    skipDuplicates: true,
  });

  // ROL: USUARIO_EXTERNO
  const rolExterno = await prisma.role.upsert({
    where: { nombre: 'USUARIO_EXTERNO' },
    update: {},
    create: {
      nombre: 'USUARIO_EXTERNO',
      descripcion: 'Usuario externo. Solo puede ver información pública vía QR.',
    },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: rolExterno.id } });
  await prisma.rolePermission.createMany({
    data: [
      { roleId: rolExterno.id, permissionId: await getPermissionId('ver_paciente') },
    ],
    skipDuplicates: true,
  });

  // ROL: ADMIN
  const rolAdmin = await prisma.role.upsert({
    where: { nombre: 'ADMIN' },
    update: {},
    create: {
      nombre: 'ADMIN',
      descripcion: 'Administrador del sistema. Acceso completo a todas las funcionalidades.',
    },
  });

  // Admin tiene TODOS los permisos
  await prisma.rolePermission.deleteMany({ where: { roleId: rolAdmin.id } });
  const todosLosPermisos = await prisma.permission.findMany();
  await prisma.rolePermission.createMany({
    data: todosLosPermisos.map(p => ({
      roleId: rolAdmin.id,
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  console.log('✅ 6 roles creados: PACIENTE, ACOMPAÑANTE, MEDICO, ENFERMERO, USUARIO_EXTERNO, ADMIN');

  // ─── 4. Crear usuario admin por defecto ────────────────────────────────────
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@sistema.com' },
    update: {},
    create: {
      email: 'admin@sistema.com',
      nombre: 'Admin',
      apellido: 'Sistema',
      password: hashedPassword,
      rolId: rolAdmin.id,
    },
  });

  console.log('✅ Usuario admin creado: admin@sistema.com / admin123');
  console.log('⚠️  CAMBIAR ESTA CONTRASEÑA EN PRODUCCIÓN');

  console.log('\n🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
