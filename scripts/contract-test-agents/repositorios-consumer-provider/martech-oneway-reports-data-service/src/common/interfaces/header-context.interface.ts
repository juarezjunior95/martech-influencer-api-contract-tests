export interface HeaderContext {
  authorization?: string;
  requestTraceId?: string;
  country?: string;
  accept?: string;
  acceptLanguage?: string;
  contentType?: string;
}
