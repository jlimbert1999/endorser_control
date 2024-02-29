import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
@NgModule({
  declarations: [],
  imports: [],
  exports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    TableModule,
    ToolbarModule,
    DropdownModule,
    ListboxModule,
  ],
})
export class PrimengModule {}
