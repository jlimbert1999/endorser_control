import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
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
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
})
export class PrimengModule {}
