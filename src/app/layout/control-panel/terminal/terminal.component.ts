import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgTerminal, NgTerminalComponent } from 'ng-terminal';
import { FormControl } from '@angular/forms';
// import { DisplayOption } from 'ng-terminal';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Terminal } from 'xterm';
import { FunctionsUsingCSI } from 'ng-terminal';
import { DevicemanagerService } from 'src/app/service/devicemanager.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
  readonly title = 'NgTerminal Live Example';
  readonly color = 'accent';
  readonly prompt = '\n' + FunctionsUsingCSI.cursorColumn(1) + '$ ';

  _rows: number = undefined;
  _cols: number = undefined;
  _draggable: boolean = undefined;

  public fixed = false;

  disabled = false;
  inputControl = new FormControl();

  underlying: Terminal;

  writeSubject = new Subject<string>();

  @ViewChild('term', {static: false}) child: NgTerminal;

  constructor(
    private deviceManagerService : DevicemanagerService
  ) { }

  command : string = ""

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.underlying = this.child.underlying;
    this.underlying.options.fontSize = 20;
    console.debug("example: font apply" );
    //this.underlying.loadAddon(new WebLinksAddon());
    this.invalidate();
    this.child.setXtermOptions({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: this.baseTheme,
      cursorBlink: true
    });
    this.child.write('$ NgTerminal Live Example');
    this.child.write(this.prompt);
    this.child.onData().subscribe((input) => {
      if (input === '\r') { // Carriage Return (When Enter is pressed)
        console.log("엔터")

        console.log(this.command)

        this.child.write(this.prompt);
        this.postDevicemanagersTerminal(this.command)
        this.command = ""
      } else if (input === '\u007f') { // Delete (When Backspace is pressed)
        if (this.child.underlying.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
          this.command = this.command.substring(0,this.command.length-1);
        }
      } else if (input === '\u0003') { // End of Text (When Ctrl and C are pressed)
          this.child.write('^C');
          this.child.write(this.prompt);
      }else{
        this.child.write(input);
        this.command += input
        //
      }
    })

    this.child.onKey().subscribe(e => {
      console.log(e)
      //onData() is used more often.
    });
    this._cols = 162
    this._rows = 40
  }

  postDevicemanagersTerminal(command : string){
    let parameter = {
      command : command,
    }
    this.deviceManagerService.postDevicemanagersTerminal(parameter).subscribe(res=>{
      console.log(res)
    },error=>{
      console.log(error)
    })
  }

  invalidate() {

  }

  baseTheme = {
    foreground: '#F8F8F8',
    background: '#2D2E2C',
    selectionBackground: '#5DA5D533',
    black: '#1E1E1D',
    brightBlack: '#262625',
    red: '#CE5C5C',
    brightRed: '#FF7272',
    green: '#5BCC5B',
    brightGreen: '#72FF72',
    yellow: '#CCCC5B',
    brightYellow: '#FFFF72',
    blue: '#5D5DD3',
    brightBlue: '#7279FF',
    magenta: '#BC5ED1',
    brightMagenta: '#E572FF',
    cyan: '#5DA5D5',
    brightCyan: '#72F0FF',
    white: '#F8F8F8',
    brightWhite: '#FFFFFF',
    border: '#85858a'
  };

}
