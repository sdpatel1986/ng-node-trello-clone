export function ERRORMSG(inputName: string) {
    let error: any = null;
    if (this.formControl.get(inputName).errors !== null) {
      error = Object.keys(this.formControl.get(inputName).errors)[0];
    }
    switch (error) {
      case 'required':
        return 'please input something';
      default:
        return '';
    }
}
