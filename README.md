<!-- calidad:inicio -->
![Calidad](https://img.shields.io/badge/Calidad-30%2F100-red) ![Cumple](https://img.shields.io/badge/Cumple-12%2F15-green) ![Aprobado](https://img.shields.io/badge/Aprobado-NO-red)

**Calidad de servicios (heurístico):** índice **30/100** · cumple **12/15** · aprobado **NO** · capas **3**
`SEC 0 · SQL 0 · DBG 2 · duplicación 14.1% · endpoints 26 · tests 0`
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
