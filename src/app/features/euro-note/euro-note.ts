import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-euro-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './euro-note.html',
  styleUrl: './euro-note.css'
})
export class EuroNoteComponent {
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  @Input() customClass: string = '';
}
