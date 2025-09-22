import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appConfirm]',
  standalone: true
})
export class ConfirmDirective {
  @Input() confirmMessage = 'Êtes-vous sûr de vouloir effectuer cette action ?';
  @Input() confirmTitle = 'Confirmation';
  @Output() confirmed = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (confirm(`${this.confirmTitle}\n\n${this.confirmMessage}`)) {
      this.confirmed.emit();
    }
  }
}
