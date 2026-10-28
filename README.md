<!-- calidad:inicio -->
![Calidad](https://img.shields.io/badge/Calidad-27%2F100-red) ![Aprobado](https://img.shields.io/badge/Aprobado-NO-red) ![Cumple](https://img.shields.io/badge/Cumple-10%2F15-yellow) ![Duplicación](https://img.shields.io/badge/Duplicaci%C3%B3n-8.8%25-green) ![SEC](https://img.shields.io/badge/SEC-0-green) ![SQL](https://img.shields.io/badge/SQL-0-green) ![DBG](https://img.shields.io/badge/DBG-2-red) ![Capas](https://img.shields.io/badge/Capas-3-green) ![Tests](https://img.shields.io/badge/Tests-0-red) ![Cob](https://img.shields.io/badge/Cob-sin%20medir-lightgrey) ![Vistas](https://img.shields.io/badge/Vistas-15-green)

**Calidad de servicios (heurístico):** índice **27/100** · cumple **10/15** · aprobado **NO** · capas **3**
Detalle completo en [`docs/EVALUACION.md`](docs/EVALUACION.md).
<!-- calidad:fin -->

Propuesta de Proyecto Final - Programación 3

Proyecto: TurnoFlex (Sistema de Gestión y Reserva de Turnos)
Integrantes: Emir [Apellido] y Máximo [Apellido] (Equipo de 2)

Objetivo Principal:
Desarrollar una plataforma web centralizada para la reserva y administración de turnos y citas para comercios de servicios (barberías, centros de estética, consultorios). El sistema permitirá a los clientes consultar horarios disponibles y solicitar turnos, mientras que los administradores/profesionales podrán gestionar su catálogo de servicios, configurar disponibilidad horaria y administrar el estado de las citas (confirmar, cancelar, completar).

Stack Tecnológico Propuesto:
- Base de Datos: PostgreSQL (ejecutado en contenedor Docker con persistencia mediante volúmenes).
- Backend (Paridad de API REST):
  1. Node.js con Express.js
  2. Python con FastAPI
- Frontend (Paridad de Interfaz y Flujo):
  1. React (con Vite)
  2. Vue.js (con Vite)
