import * as UsuariosService from "@/services/UsuariosService";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";

export function useAccionesUsuario({ recargar } = { recargar: async () => {} }) {
  const toast = useToast();

  const mostrarDialogo = ref(false);
  const modo = ref("crear"); 
  const usuarioSel = ref(null);

  const form = ref({
    id: null,                
    idUsuario: "",            
    nombre: "",            
    matricula: "",         
    correo: "",              
    password: "",            
    contrasena: "",          
    id_rol: null,             
    fecha_asignacion: "",     
  });

  const errores = ref({});

  const abrirCrear = () => {
    modo.value = "crear";
    form.value = {
      id: null,
      idUsuario: "",
      nombre: "",
      matricula: "",
      correo: "",
      password: "",
      contrasena: "",
      id_rol: null,
      fecha_asignacion: "",
    };
    errores.value = {};
    mostrarDialogo.value = true;
  };

  const abrirEditar = async (fila) => {
    try {
      const detalle = await UsuariosService.getUsuarioById(fila.id);

      form.value = {
        id: detalle.id_usuario_roles ?? fila.id,
        idUsuario: detalle.id_usuario ?? fila.idUsuario ?? "",
        nombre: detalle.nombre_completo ?? fila.nombre ?? "",
        matricula: detalle.matricula ?? "",
        correo: detalle.correo ?? fila.correo ?? "",
        password: "", 
        contrasena: detalle.contrasena ?? "",
        id_rol: detalle.id_rol ?? fila.rolId ?? null,
        fecha_asignacion:
          detalle.fecha_asignacion ??
          fila.fechaRegistro ??
          new Date().toISOString(),
      };

      modo.value = "editar";
      errores.value = {};
      mostrarDialogo.value = true;
    } catch (e) {
      console.error(e);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar el usuario.",
        life: 3000,
      });
    }
  };

  const abrirVer = (fila) => {
    usuarioSel.value = fila;
    modo.value = "ver";
    mostrarDialogo.value = true;
  };

  const cerrarDialogo = () => (mostrarDialogo.value = false);

  const validar = () => {
    const e = {};
    if (!form.value.nombre?.trim()) e.nombre = "Nombre requerido";
    if (!form.value.correo?.trim()) e.correo = "Correo requerido";
    if (!form.value.id_rol) e.id_rol = "Rol requerido";

    if (modo.value === "crear") {
      if (!form.value.idUsuario?.trim()) e.idUsuario = "ID de usuario requerido";
      if (!form.value.matricula?.trim()) e.matricula = "Matrícula requerida";
      if (!form.value.password?.trim()) e.password = "Contraseña requerida";
    }

    errores.value = e;
    return Object.keys(e).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;

    try {
      if (modo.value === "crear") {
        const payloadCreate = {
          id_usuario: form.value.idUsuario,
          nombre_completo: form.value.nombre,
          matricula: form.value.matricula,
          correo: form.value.correo,
          id_rol: form.value.id_rol,
          fecha_asignacion: new Date().toISOString(),
          contrasena: form.value.password,
        };

        await UsuariosService.createUsuario(payloadCreate);
        toast.add({ severity: "success", summary: "Creado", detail: "Usuario creado.", life: 2500 });
      } else {
        const payloadUpdate = {
          id_usuario_roles: form.value.id,        
          id_usuario: form.value.idUsuario,
          nombre_completo: form.value.nombre,
          matricula: form.value.matricula,
          correo: form.value.correo,
          id_rol: form.value.id_rol,
          fecha_asignacion: form.value.fecha_asignacion || new Date().toISOString(),
          contrasena: form.value.contrasena || "", 
        };

        await UsuariosService.updateUsuario(form.value.id, payloadUpdate);
        toast.add({ severity: "success", summary: "Actualizado", detail: "Usuario actualizado.", life: 2500 });
      }

      mostrarDialogo.value = false;
      await recargar();
    } catch (e) {
      console.error("Guardar usuario error:", e?.response?.data ?? e);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: e?.response?.data ?? "No se pudo guardar.",
        life: 3500,
      });
    }
  };

  const eliminar = async (fila) => {
    try {
      await UsuariosService.deleteUsuario(fila.id); 
      toast.add({ severity: "success", summary: "Eliminado", detail: "Usuario eliminado.", life: 2500 });
      await recargar();
    } catch (e) {
      toast.add({ severity: "error", summary: "Error", detail: "No se pudo eliminar.", life: 3000 });
    }
  };

  return {
    mostrarDialogo,
    modo,
    form,
    errores,
    usuarioSel,
    abrirCrear,
    abrirEditar,
    abrirVer,
    cerrarDialogo,
    guardar,
    eliminar,
  };
}
