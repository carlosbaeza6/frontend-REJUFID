import * as UsuariosService from "@/services/UsuariosService";
import { onMounted, ref } from "vue";

const roleName = (id) => ({ 1: "Administrador", 2: "Básico", 3: "Juez" }[Number(id)] ?? "—");

const ROLES_OPTIONS = [
  { label: "Administrador", value: 1 },
  { label: "Básico", value: 2 },
  { label: "Juez", value: 3 },
];

export function useUsuarios() {
  const loading = ref(false);
  const usuarios = ref([]);

  const filtros = ref({
    rolId: null,
    palabraClave: "",
  });

  const cargarUsuarios = async () => {
    loading.value = true;
    try {
      const params = {
        rolId: filtros.value.rolId || undefined,
        q: filtros.value.palabraClave || undefined,
      };
      const data = await UsuariosService.getUsuarios(params);

      let rows = (data ?? []).map((u) => {
        const idUsuarioRol =
          u.id_usuario_roles ?? u.Id_usuario_roles ?? u.id_usuario_rol ?? u.id;
        const idUsuario = u.id_usuario ?? u.Id_usuario ?? null;
        const rolId = u.id_rol ?? u.Id_rol ?? u.rolId ?? null;
        const fecha =
          u.fecha_asignacion ??
          u.fecha_registro ??
          u.FechaRegistro ??
          u.createdAt ??
          null;

        return {
          id: idUsuarioRol,             
          idUsuario,                    
          nombre: u.nombre_completo ?? u.nombre ?? u.Nombre ?? "",
          correo: u.correo ?? u.Correo ?? "",
          rolId,
          rol: roleName(rolId),
          fechaRegistro: fecha,
        };
      });

      if (filtros.value.rolId != null) {
        rows = rows.filter((r) => Number(r.rolId) === Number(filtros.value.rolId));
      }
      if (filtros.value.palabraClave?.trim()) {
        const q = filtros.value.palabraClave.trim().toLowerCase();
        rows = rows.filter(
          (r) =>
            (r.nombre ?? "").toLowerCase().includes(q) ||
            (r.correo ?? "").toLowerCase().includes(q)
        );
      }

      usuarios.value = rows;
    } catch (e) {
      console.error("Error cargando usuarios:", e);
    } finally {
      loading.value = false;
    }
  };

  const aplicarFiltros = () => cargarUsuarios();

  onMounted(cargarUsuarios);

  const rolesOptions = ROLES_OPTIONS;

  return {
    loading,
    usuarios,
    rolesOptions,
    filtros,
    cargarUsuarios,
    aplicarFiltros,
  };
}
