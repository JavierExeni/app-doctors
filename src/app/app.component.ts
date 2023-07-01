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
import { FormBuilder } from '@angular/forms';
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
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
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
  };

  formDoctor = this.fb.group({
    patient: [''],
    carrer: [''],
    doctor: [''],
    turn: [''],
  });

  currentEvents: EventInput[] = [
    {
      allDay: true,
      backgroundColor: 'red',
      date: '2023-06-29T10:00:00',
    },
  ];

  patients: any[] = [];
  carrers: any[] = [];
  doctors: any[] = [];
  days: any[] = [];
  turns: any[] = [];
  dates: any[] = [];



  constructor(
    private changeDetector: ChangeDetectorRef,
    private fb: FormBuilder,
    private carrerService: CarrerService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private turnService: TurnService,
    
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
        console.log(res);
        
        this.doctorsByCarrerId(res);
        this.daysByCarrerId(res);
      },
    });

    this.formDoctor.get('doctor')?.valueChanges.subscribe({
      next: (res: any) => {
        this.daysByDoctorId(res);
        this.turnsByDoctor(res)
      },
    });

    this.formDoctor.get('turn')?.valueChanges.subscribe({
      next: (res: any) => {
        this.datesByTurnId(res)
      },
    });
  }

  datesByTurnId(id: number) {
    this.turnService.datesByTurn(id).subscribe({
      next: (res: any) => this.dates = res.fechas
    });
  }

  doctorsByCarrerId(id: number) {
    this.doctorService.doctorsByCarrerId(id).subscribe({
      next: (res) => this.doctors = res.doctores
    });
  }

  turnsByDoctor(id: number) {
    this.turnService.turnsByDoctor(id).subscribe({
      next: (res: any) => this.turns = res.turnos
    });    
  }

  daysByCarrerId(id: number) {
    this.carrerService.daysByCarrer(id).subscribe({
      next: (res: any) => this.days = res.dias
    });
  }

  daysByDoctorId(id: number) {
    this.doctorService.daysByDoctor(id).subscribe({
      next: (res: any) => this.days = res.dias
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
    // const title = prompt('Please enter a new title for your event');
    console.log(selectInfo);

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay,
    //   });
    // }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo);

    // if (
    //   confirm(
    //     `Are you sure you want to delete the event '${clickInfo.event.title}'`
    //   )
    // ) {
    //   clickInfo.event.remove();
    // }
  }

  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
}
