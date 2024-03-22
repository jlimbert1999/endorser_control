import { Injectable } from '@angular/core';
import {
  Content,
  ContentTable,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Endorser } from '../../domain/models';
import {
  applicantReponse,
  officerResponse,
} from '../../infrastructure/interfaces';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  generateOfficers(
    title: string,
    officers: officerResponse[],
    endorser: Endorser
  ) {
    const content: Content[] = [
      {
        columns: [
          {
            width: 90,
            text: 'AVAL: ',
            bold: true,
          },
          {
            text: `${endorser.name} - ${endorser.organization}`,
          },
        ],
        marginBottom: 20,
      },
      {
        fontSize: 9,
        table: {
          widths: [60, '*', '*', 60],
          body: [
            [
              { text: 'CI', style: 'tableHeader' },
              { text: 'Nombre', style: 'tableHeader' },
              { text: 'Cargo', style: 'tableHeader' },
              { text: 'Grupo', style: 'tableHeader' },
            ],
            ...officers.map((el) => [
              el.dni ?? '',
              `${el.nombre} ${el.paterno ?? ''} ${
                el.materno ?? ''
              }`.toUpperCase(),
              el.cargo?.nombre ?? 'Sin cargo',
              el.cargo?.tipoContrato ?? '----',
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ];

    this.generate(title, content);
  }
  generateApplicants(
    title: string,
    officers: applicantReponse[],
    endorser: Endorser
  ) {
    const content: Content[] = [
      {
        columns: [
          {
            width: 90,
            text: 'AVAL: ',
            bold: true,
          },
          {
            text: `${endorser.name} - ${endorser.organization}`,
          },
        ],
        marginBottom: 20,
      },
      {
        fontSize: 9,
        table: {
          widths: [60, '*', '*', '*', 60],
          body: [
            [
              { text: 'CI', style: 'tableHeader' },
              { text: 'Nombre', style: 'tableHeader' },
              { text: 'Candidato por', style: 'tableHeader' },
              { text: 'Perfil profesional', style: 'tableHeader' },
              { text: 'Telefono', style: 'tableHeader' },
            ],
            ...officers.map((el) => [
              el.dni ?? '',
              `${el.firstname} ${el.middlename ?? ''} ${
                el.lastname ?? ''
              }`.toUpperCase(),
              el.candidate_for ?? 'Sin cargo',
              el.professional_profile ?? '----',
              el.phone ?? '----',
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ];

    this.generate(title, content);
  }

  generateEndorsers(title: string, endorser: Endorser[]) {
    const content = [
      {
        headerRows: 1,
        fontSize: 9,
        table: {
          widths: ['*', '*', 80, 80],
          body: [
            [
              { text: 'Nombre', style: 'tableHeader' },
              { text: 'Organizacion', style: 'tableHeader' },
              { text: 'Funcionarios Avalados', style: 'tableHeader' },
              { text: 'Postulantes Avalados', style: 'tableHeader' },
            ],
            ...endorser.map((el) => [
              el.name,
              el.organization,
              el.total_officers,
              el.total_applicants,
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ];
    this.generate(title, content);
  }

  private generate(title: string, content: Content[]) {
    const docDefinition: TDocumentDefinitions = {
      header: {
        columns: [
          {
            width: '*',
            text: title,
            bold: true,
            fontSize: 16,
          },
          {
            width: 100,
            text: `${new Date().toLocaleString()}`,
            fontSize: 10,
            bold: true,
            alignment: 'left',
          },
        ],
        margin: [20, 20, 20, 20],
      },
      footer: {
        margin: [10, 0, 10, 0],
        fontSize: 8,
        text: `Módulo: V.1 - Dotacion de personal`,
      },
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      pageMargins: [30, 80, 30, 30],
      content: content,
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 13,
        },
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }
}
