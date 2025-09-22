import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuroNote } from './euro-note';

describe('EuroNote', () => {
  let component: EuroNote;
  let fixture: ComponentFixture<EuroNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EuroNote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EuroNote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
