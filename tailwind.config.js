/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        borde: "hsl(var(--borde))",
        entrada: "hsl(var(--entrada))",
        anillo: "hsl(var(--anillo))",
        fondo: "hsl(var(--fondo))",
        primerPlano: "hsl(var(--primer-plano))",
        primario: {
          DEFAULT: "hsl(var(--primario))",
          primerPlano: "hsl(var(--primario-primer-plano))",
        },
        secundario: {
          DEFAULT: "hsl(var(--secundario))",
          primerPlano: "hsl(var(--secundario-primer-plano))",
        },
        destructivo: {
          DEFAULT: "hsl(var(--destructivo))",
          primerPlano: "hsl(var(--destructivo-primer-plano))",
        },
        apagado: {
          DEFAULT: "hsl(var(--apagado))",
          primerPlano: "hsl(var(--apagado-primer-plano))",
        },
        acento: {
          DEFAULT: "hsl(var(--acento))",
          primerPlano: "hsl(var(--acento-primer-plano))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          primerPlano: "hsl(var(--popover-primer-plano))",
        },
        tarjeta: {
          DEFAULT: "hsl(var(--tarjeta))",
          primerPlano: "hsl(var(--tarjeta-primer-plano))",
        },
      },
      borderRadius: {
        lg: "var(--radio)",
        md: "calc(var(--radio) - 2px)",
        sm: "calc(var(--radio) - 4px)",
      },
    },
  },
  plugins: [],
}

