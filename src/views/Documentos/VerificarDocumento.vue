<script setup>
import { useVerificarDocumento } from '@/composables/useVerificarDocumento';

const {
  archivo,
  resultado,
  cargando,
  error,
  puedeVerificar,
  setFile,
  verificar,
  limpiar
} = useVerificarDocumento()
</script>

<template>
  <div class="vd-container">
    <div class="vd-card">
      <h2 class="vd-title">Verificación de documentos</h2>
      <p class="vd-subtitle">Sube un PDF para validar si está firmado y por quién.</p>

      <div class="vd-uploader" @click="$refs.input?.click()">
        <input
          id="input-pdf"
          ref="input"
          type="file"
          accept="application/pdf"
          class="vd-input"
          @change="(e) => setFile(e.target?.files?.[0] || null)"
        />
        <div class="vd-uploader-text">
          Haz clic para seleccionar un PDF
        </div>
        <div v-if="archivo" class="vd-file">
          Seleccionado: <strong>{{ archivo.name }}</strong>
        </div>
      </div>

      <div class="vd-actions">
        <button
          class="vd-btn vd-btn-success"
          :disabled="!puedeVerificar || cargando"
          @click="verificar"
        >
          <span v-if="cargando">Verificando…</span>
          <span v-else>Verificar</span>
        </button>
        <button class="vd-btn" :disabled="cargando" @click="limpiar">
          Limpiar
        </button>
      </div>

      <div v-if="error" class="vd-error">{{ error }}</div>

      <div v-if="resultado" class="vd-result">
        <div :class="['vd-badge', resultado.valido ? 'vd-badge-ok' : 'vd-badge-warn']">
          <strong>{{ resultado.valido ? 'Documento válido y firmado' : 'No válido' }}</strong>
          <span v-if="resultado.mensaje"> · {{ resultado.mensaje }}</span>
        </div>

        <div class="vd-grid">
          <div class="vd-field">
            <div class="vd-label">Hash</div>
            <div class="vd-mono">{{ resultado.hash || '—' }}</div>
          </div>
          <div class="vd-field">
            <div class="vd-label">Firmante</div>
            <div>{{ resultado.usuarioFirmante || '—' }}</div>
          </div>
          <div class="vd-field">
            <div class="vd-label">Fecha firma</div>
            <div>{{ resultado.fechaFirma ? new Date(resultado.fechaFirma).toLocaleString() : '—' }}</div>
          </div>
          <div class="vd-field">
            <div class="vd-label">UUID</div>
            <div class="vd-mono">{{ resultado.uuid || '—' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vd-container { max-width: 1100px; margin: 0 auto; padding: 18px; }
.vd-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; }
.vd-title { margin: 0 0 6px; font-size: 22px; font-weight: 600; }
.vd-subtitle { margin: 0 0 18px; color: #6b7280; font-size: 14px; }

.vd-uploader {
  border: 2px dashed #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  min-height: 90px;
}
.vd-uploader:hover { background: #fafafa; }
.vd-input { display: none; }
.vd-uploader-text { color: #4b5563; }
.vd-file { margin-top: 10px; font-size: 14px; color: #374151; }

.vd-actions { display: flex; gap: 10px; margin-top: 16px; }
.vd-btn {
  padding: 9px 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  cursor: pointer;
}
.vd-btn:hover { background: #f3f4f6; }
.vd-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.vd-btn-success {
  background: #16a34a;         
  border-color: #16a34a;
  color: #fff;
}
.vd-btn-success:hover { background: #15803d; } 

.vd-error {
  margin-top: 12px;
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
}
.vd-result { margin-top: 18px; }
.vd-badge {
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 12px;
}
.vd-badge-ok { background: #ecfdf5; color: #065f46; }
.vd-badge-warn { background: #fffbeb; color: #92400e; }

.vd-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 768px) { .vd-grid { grid-template-columns: 1fr 1fr; } }
.vd-field { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; }
.vd-label { color: #6b7280; font-size: 12px; margin-bottom: 4px; }
.vd-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  word-break: break-all;
}
</style>
