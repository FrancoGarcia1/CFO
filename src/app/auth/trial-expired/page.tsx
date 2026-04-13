'use client';

const PLAN_FEATURES = [
  'Registro ilimitado de transacciones',
  'Dashboard + exportes PDF y Excel',
  'Rolling forecast trimestral',
  'Simulador P&L completo',
  'Chat CFO sin limites',
  '1 sesion de revision por videollamada',
];

export default function TrialExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 font-sans text-foreground">
      <div className="w-full max-w-[460px] text-center">
        <div className="mb-3.5 text-[44px]">🔒</div>
        <h2 className="mb-2.5 text-[22px] font-extrabold text-white">
          Tu prueba de 7 dias ha terminado
        </h2>
        <p className="mb-7 text-[13px] leading-relaxed text-muted-foreground">
          Viste el poder de tener un CFO Senior en tu negocio.
          <br />
          Activa tu plan para acceso ilimitado al chat y todas las funciones.
        </p>

        <div className="mb-5 rounded-lg border border-border bg-card p-6">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-primary">
            PLAN MENSUAL
          </div>
          <div className="mb-1 text-[34px] font-extrabold text-white">
            S/ 800
            <span className="text-[15px] font-normal text-muted-foreground">
              /mes
            </span>
          </div>

          <div className="mt-4 space-y-2 text-left">
            {PLAN_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="text-xs text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>

          <a
            href="mailto:contacto@vcfo.ai?subject=Quiero activar Franco Garcia · Consultor Financiero"
            className="bg-primary mt-5 block rounded-md py-3.5 text-sm font-bold text-black transition-colors hover:bg-primary/90"
          >
            Activar plan completo →
          </a>
        </div>
      </div>
    </div>
  );
}
