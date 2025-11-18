import { MatDateFormats } from '@angular/material/core';

// Define o formato de data brasileiro (DD/MM/YYYY) para exibição e leitura (parsing)
export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    // Esta linha é crucial: define que a entrada do usuário (digitação) deve ser lida como DD/MM/YYYY
    dateInput: 'DD/MM/YYYY', 
  },
  display: {
    // Define o formato de como a data será exibida no input após ser selecionada
    dateInput: 'DD/MM/YYYY',
    // Define o formato do label do mês/ano no calendário
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};