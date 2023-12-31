import { ChangeDetectorRef, OnInit, Component } from '@angular/core';

import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { CarrerService } from './services/carrer.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PatientService } from './services/patient.service';
import { DoctorService } from './services/doctor.service';
import { TurnService } from './services/turn.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      right: 'title',
    },
    initialView: 'dayGridMonth',
    locale: esLocale,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: [],
  };

  formDoctor = this.fb.group({
    patient: ['', Validators.required],
    carrer: ['', Validators.required],
    doctor: ['', Validators.required],
    turn: ['', Validators.required],
  });

  patients: any[] = [];
  carrers: any[] = [];
  doctors: any[] = [];
  days: any[] = [];
  turns: any[] = [];
  dates: any[] = [];

  dias = {
    dias: [
      { id: 1, nombre: 'Lunes', index: 1 },
      { id: 3, nombre: 'Miercoles', index: 3 },
      { id: 5, nombre: 'Viernes', index: 5 },
    ],
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private fb: FormBuilder,
    private carrerService: CarrerService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private turnService: TurnService
  ) {}
  ngOnInit(): void {
    this.patientService.getPatients().subscribe({
      next: (res) => (this.patients = res.pacientes),
    });
    this.carrerService.getCarrers().subscribe({
      next: (res) => (this.carrers = res.especialidades),
    });

    this.formDoctor.get('carrer')?.valueChanges.subscribe({
      next: (res: any) => {
        this.doctorsByCarrerId(res);
        this.daysByCarrerId(res);
      },
    });

    this.formDoctor.get('doctor')?.valueChanges.subscribe({
      next: (res: any) => {
        this.daysByDoctorId(res);
        this.turnsByDoctor(res);
      },
    });

    this.formDoctor.get('turn')?.valueChanges.subscribe({
      next: (res: any) => {
        this.datesByTurnId(res);
      },
    });
  }

  datesByTurnId(id: number) {
    this.turnService.datesByTurn(id).subscribe({
      next: (res: any) => {
        let dates = res.fechas;
        let events: any[] = [];
        dates.forEach((element: any) => {
          events.push({
            date: element.data,
            backgroundColor: '#cfe2ff',
            borderColor: '#9ec5fe',
            display: 'auto',
            title: `Disponibles: ${element.nroReservasDisponibles}`,
            textColor: '#052c65',
            extendedProps: {
              dates: element.horarios,
            },
          });
        });
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...(this.calendarOptions.events as any[]), ...events],
        };
      },
    });
  }

  doctorsByCarrerId(id: number) {
    this.doctorService.doctorsByCarrerId(id).subscribe({
      next: (res) => (this.doctors = res.doctores),
    });
  }

  turnsByDoctor(id: number) {
    this.turnService.turnsByDoctor(id).subscribe({
      next: (res: any) => (this.turns = res.turnos),
    });
  }

  daysByCarrerId(id: number) {
    this.carrerService.daysByCarrer(id).subscribe({
      next: (res: any) => {
        this.days = res.dias;
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [
            {
              allDay: true,
              backgroundColor: '#acddc7',
              display: 'background',
              daysOfWeek: this.days.map((el) => el.index),
            },
          ],
        };
      },
    });
  }

  daysByDoctorId(id: number) {
    this.doctorService.daysByDoctor(id).subscribe({
      next: (res: any) => {
        this.days = res.dias;

        this.calendarOptions = {
          ...this.calendarOptions,
          events: [
            {
              allDay: true,
              backgroundColor: '#acddc7',
              display: 'background',
              daysOfWeek: this.days.map((el) => el.index),
            },
          ],
        };
      },
    });
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event.extendedProps);
    this.dates = clickInfo.event.extendedProps['dates'];
    console.log(this.dates);
  }

  handleEvents(events: EventApi[]) {
    this.changeDetector.detectChanges();
  }

  onSubmit() {
    console.log('Registrar');
  }
}
