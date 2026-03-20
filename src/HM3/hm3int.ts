
type RawUrlField = {
      Url?: string | null;
      Description?: string | null;
    }  ;

export interface IOrgCompany {
  Id: number;
  Title: string;

  // Text / Note fields
  City?: string;
  Value?: string;
  ParticipationType?: string;
  BackColor?: string;
  FontColor?: string;
  Geschaftsadresse?: string;
  Beteiligungsquote?: string;
  Ergebnisabfuhrungsvertrag?: string;
  StanmkapitalGeschaftsanteile?: string;
  Beteiligungsbuchwert?: string;
  Unternehmenszweck?: string;
  HRBNr?: string;
  StNr?: string;
  Ladungsfrist?: string;
  AufsichtsratExt?: string;
  BeiratExt?: string;
  Postfach?: string;

  // Boolean fields
  Beteiligung?: boolean;
  Inaktiv?: boolean;
  Anfrage_x0020_senden?: boolean;

  // Date fields
  Grundungam?: string;
  Eintragungam?: string;

  // URL fields
  LinkUrl?: RawUrlField;
  Logo?: string;
  Logo_x0020_Large?: string;
}


export interface IRelation {
  Id: number,
  Parent: number,
  Child: number,
  Share: number
}



