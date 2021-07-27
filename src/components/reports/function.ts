import Util from "../../libraries/util/util"
import DateConvert from '../../libraries/util/date'
import logger from "../../libraries/util/logger";
import ReportError from "./error";
const xl = require('excel4node');
const fs = require('fs');
const converter = require('office-converter')();
export default class InnerFunction {

    static getExcelRes = (dbData : any[], level : string, type : string, control_info: any) => {
      return new Promise(function(resolve: any, reject: any) {
        try{
          let commonStyleColor = {
            style: 'thin',
            color: 'black',
          }
          let commonBorder = {
            left: commonStyleColor,
            right: commonStyleColor,
            top: commonStyleColor,
            bottom: commonStyleColor,
            outline: false,
          }

          let commonAlignment = {
            wrapText: true,
            horizontal: 'center',
            vertical: 'center'
          }

          const excelData :any[] = sortData(dbData); // device_id => ([[이력1, 이력2], [이력1], [이력1, 이력2]])

          let wsOption = {
            'pageSetup' : {
              'scale' : 43
            }
          }
          let wb = new xl.Workbook();
          if(type == 'analyze') {
            let analyzeImgPath : string = __dirname + '/../../../../public/excel/analyzeCapture.jpg'
            let wsAnalyze = wb.addWorksheet('통합분석');  
            fs.exists(analyzeImgPath, function (exists: boolean) {
              if (!exists) {
              } else {
                wsAnalyze.addImage({
                  path: analyzeImgPath,
                  type: 'picture',
                  position: {
                    type: 'twoCellAnchor',
                    from: {
                      col: 3,
                      colOff: 0,
                      row: 3,
                      rowOff: 0
                    },
                    to: {
                      col: 24,
                      colOff: 0,
                      row: 34,
                      rowOff: 0
                    }
                  }                            
                })
              }        
            });             
          } 
          

          let ws = wb.addWorksheet('시험이력', wsOption);
          let style1 = wb.createStyle({
              font: {
                color: '#000000',
                bold: true,
                size: 12,
                bolder: true
              },
              fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#C7C7C5',
                fgColor: '#C7C7C5',
              },
              alignment: commonAlignment,
              border: commonBorder,
          });
      
          let style2 = wb.createStyle({
              font: {
                color: '#000000',
                size: 11,
              },
              alignment: commonAlignment,
              border: commonBorder,
          });
      
          let style3 = wb.createStyle({
              font: {
                color: '#1689DB',
                size: 11,
              },
              alignment: commonAlignment,
              border: commonBorder,
          });

          let style4 = wb.createStyle({
            font: {
              color: '#000000',
              size: 8,
            },
            alignment: commonAlignment,
            border: commonBorder,
        });
          let fieldSize = 12;
          if (level == '1') {
            fieldSize = 13;
          }
      
          for (let i = 0; i < fieldSize; i++) {
            let width0 : number = 7;
            let width1 : number = 12;
            let width2 : number = 15;
            let width3 : number = 20;
      
            if (i == 3 ||i == 4 || i == 5 || i == 10|| i == 11 || i == 12) {
              ws.column(i+1).setWidth(width3);
            } else if (i == 0){
              ws.column(i+1).setWidth(width0);
            } else if (i == 6) {
              ws.column(i+1).setWidth(width2);
            } else {
              ws.column(i+1).setWidth(width1);
            }
          }
      
          ws.cell(1, 1).string('번호').style(style1);
          ws.cell(1, 2).string('학생명').style(style1);
          ws.cell(1, 3).string('학번').style(style1);
          ws.cell(1, 4).string('인증샷').style(style1);
          ws.cell(1, 5).string('시험시작시간').style(style1);
          ws.cell(1, 6).string('시험종료시간').style(style1);
          ws.cell(1, 7).string('총 시험시간').style(style1);
          ws.cell(1, 8).string('접속횟수').style(style1);
          ws.cell(1, 9).string('서비스결과').style(style1);
          ws.cell(1, 10).string('감독관판단').style(style1);
          ws.cell(1, 11).string('상세이력').style(style1);
          ws.cell(1, 12).string('체크항목').style(style1);
          ws.cell(1, 13).string('접속기록').style(style1);

          if (level == '1') {            
            ws.cell(1, 14).string('영상재생').style(style1);  
          }        

          for (let i =0; i < dbData.length; i ++) {
            ws.row(2+i).setHeight(20);  //전체 20size 초기화
          }
      

          // 셀 그리기 시작
          let row_index = 2; // 학생단위 index
          for (let idx = 0; idx < excelData.length; idx ++) {      //학생 이력 데이터 순회     
            let oneStudentData : any[] = excelData[idx];
            let mergeIdx : number = oneStudentData.length -1;

            if (oneStudentData.length < 5) {   // row height 조정
              let len: number = oneStudentData.length;
              for (let idx = 0; idx < len; idx ++) {
                ws.row(row_index + idx).setHeight(100/len);
              }
            } 
            ws.cell(row_index, 1, row_index + mergeIdx, 1, true).number(idx+1).style(style2);
            // 학번, 이름이 같을 경우 셀 합치기 Map 생성
            let mapTemp = new Map();
            for (let item of oneStudentData) {
              let key = `${item.CUST_NM}${item.ADMIN_ID}`;
              if (mapTemp.has(key)) {   //다시 [학번, 이름]을 key로 map 처리
                let arrTemp = mapTemp.get(key);
                arrTemp.push(item);
                mapTemp.set(key, arrTemp);
              } else {
                mapTemp.set(key, [item]);
              }
            }
            
            ////////



            ///////셀 그리기
            let firstIdxFlag = false;
            let row_index2 = row_index; // 아래 map, value단위 index
            mapTemp.forEach(function (value, key, map) { //1학생의 이력이 여러개인 경우 이력1 ~ 이력n 까지 순회 / value = [{이력1},{이력2},{이력3}]
              
              let mergeIdx2 : number = value.length -1; //합쳐야할 갯수 -1
              let firstHistory : any = value[0];
              
              if (value.length > 1) {       
                ws.cell(row_index2, 2, row_index2 + mergeIdx2, 2, true).string(firstHistory.CUST_NM).style(style2);
                ws.cell(row_index2, 3, row_index2 + mergeIdx2, 3, true).string(firstHistory.ADMIN_ID).style(style2);
              } else {
                ws.cell(row_index2, 2).string(firstHistory.CUST_NM).style(style2);
                ws.cell(row_index2, 3).string(firstHistory.ADMIN_ID).style(style2);
              }

              let rowPlus = 0;
              for (let item of value) {     //  접속기록 / vod재생 버튼 반복
                let i_date : string = toDateForm(item.INSERT_DATE);
                let u_date : string = toDateForm(item.UPDATE_DATE);
                let joinRecord : string = `${deleteYear(i_date)} ~ ${deleteYear(u_date)}`
                
                let checkString : string = '';
                if (item.ERR_1 == '1') checkString += ' 인터넷불량/'
                if (item.ERR_2 == '1') checkString += ' 서비스오류/'
                if (item.ERR_3 == '1') checkString += ' 학번중복/'
                if (item.ERR_4 == '1') checkString += ' 최소참여시간미만/'
                if (item.ERR_5 == '1') checkString += ' 시험진행시간초과/'
                if (item.U_BOOKMARK == '1') checkString += ' 사용자북마크/'
                checkString = checkString.slice(0, checkString.length -1)
                ws.cell(row_index2 + rowPlus, 12).string(checkString).style(style4); // 체크항목              
                ws.cell(row_index2 + rowPlus, 13).string(joinRecord).style(style2); // 접속기록              
  
                if (level == '1') {
                  if (item.UPLOAD_FILE_NM != undefined && item.UPLOAD_FILE_NM != '') {
                    ws.cell(row_index2 + rowPlus, 14).link(`upload/${item.UPLOAD_FILE_NM}`).string("VOD재생").style(style3);
                  } else {
                    ws.cell(row_index2 + rowPlus, 14).string('-').style(style2);
                  }           
                }
                rowPlus += 1;
              }                

              if (!firstIdxFlag) { 
                firstIdxFlag = true;
                ////////////////인증샷
                ws.cell(row_index, 4, row_index + mergeIdx, 4, true)
                
                let img_row = row_index;
                const getThumbName = (arr : any[]) => {
                  let resultPath : string = '';
                  for (let item of arr) {
                    if (item.LOCATION_FIRST != '' && item.LOCATION_FIRST != null) {
                      resultPath = item.LOCATION_FIRST;
                      break;
                    } else if (item.LOCATION_LAST != '' && item.LOCATION_LAST != null) {
                      resultPath = item.LOCATION_LAST;
                      break;
                    }
                  }
                  return resultPath;
                }
                let path : string = getThumbName(oneStudentData);
                fs.exists(path, function (exists: boolean) {
                  if (!exists) {
                  } else {
                    imgDraw(ws, mergeIdx, img_row, path);
                  }        
                });             
                ///////////////////////////


                let total_gapStr : string = '';
                let diffHour : any = 0;
                let diffMin : any = 0;
                let diffSec : any = 0;

                for (let item of oneStudentData) {
                  diffHour += item.diffHour;
                  diffMin += item.diffMin;
                  diffSec += item.diffSec;
                }

                if (diffSec >= 60) { // 초가 60이 넘으면 분을 올림
                    let _sec: any = diffSec / 60;
                    diffMin += _sec;
                    let remainder = diffSec % 60;
                    diffSec = remainder;
                }

                if (diffMin >= 60) { // 분이 60이 넘으면 시간을 올림
                    let _min: any = String(diffMin / 60);
                    diffHour += _min;
                    let remainder = diffMin % 60;
                    diffMin = remainder;
                }                

                total_gapStr += diffHour != 0 ? `${parseInt(diffHour)}시 ` : '';
                total_gapStr += diffMin != 0 ? `${parseInt(diffMin)}분 ` : '';
                total_gapStr += diffSec != 0 ? `${parseInt(diffSec)}초` : '';

                let min_insert_date: any = getMinInsertDate(oneStudentData);
                let max_update_date: any = getMaxUpdateDate(oneStudentData);

                
                ws.cell(row_index, 5, row_index + mergeIdx, 5, true).string(toDateForm(String(min_insert_date))).style(style2);
                ws.cell(row_index, 6, row_index + mergeIdx, 6, true).string(toDateForm(String(max_update_date))).style(style2);
                ws.cell(row_index, 7, row_index + mergeIdx, 7, true).string(total_gapStr).style(style2); //총시험시간
                ws.cell(row_index, 8, row_index + mergeIdx, 8, true).string(String(oneStudentData.length)).style(style2); //접속횟수
                let sys_passfail = '정상'
                let user_passfail = '정상'
                if (firstHistory.SYS_PASSFAIL != '0') {
                  sys_passfail = '체크필요'
                }
                if (firstHistory.USER_PASSFAIL == '1') {
                  user_passfail = '미판정' 
                } else if (firstHistory.USER_PASSFAIL == '2') {
                  user_passfail = '비정상'
                }

                ws.cell(row_index, 9, row_index + mergeIdx, 9, true).string(sys_passfail).style(style2); //서비스 결과
                ws.cell(row_index, 10, row_index + mergeIdx, 10, true).string(user_passfail).style(style2); //감독관 판단
                ws.cell(row_index, 11, row_index + mergeIdx, 11, true).string(firstHistory.REVIEW).style(style2); //상세이력
              }
              row_index2 += value.length;
            })

            row_index += oneStudentData.length;
          }
          
          fs.exists(`/DATA1/VCS/REPORT`, checkPath1);
          function checkPath1(exist: boolean) {
            if (!exist) {
              fs.mkdir(`/DATA1/VCS/REPORT`, checkPath2);
            } else {
              checkPath2();
            }         
          }

          function checkPath2() {
            fs.exists('/DATA1/VCS/REPORT/'+control_info.CODE_ID, function(exist: any) {
              if (!exist) {
                
                fs.mkdir('/DATA1/VCS/REPORT/'+control_info.CODE_ID, createFile)  
              } else {
                createFile(undefined);
              }
            })
          }        

          function createFile(err: any) {
            if (err) {
              reject('0003');
            } else {
              let filepath : string = '/DATA1/VCS/REPORT/'+control_info.CODE_ID+'/LiveSeeYou_시험이력_'+control_info.CTL_NM+'.xlsx'
              wb.write(filepath, function(error : any){
                logger.info('5')
                if (error) {
                  logger.info('6' + error)
                  reject('0003');
                } else {
                  // converter.generatePdf(filepath, function(err: any, result:any) {
                    
                  //   if (err) {
                  //     reject('0003');
                  //   } else {
                  //     resolve(result.outputFile);
                      resolve(filepath);
                  //   }                  
                  // });                
                }
              });
            }            
          }
        } catch (error) {
          logger.info(error)
          reject('0003');
        }
      })
    }
}

const sortData = (dbData : any[]) => {
  for (let j =0; j < dbData.length; j++) {
    //시간 계산
    
    let updateDate : any = DateConvert.getStringToDateTime(dbData[j].UPDATE_DATE);
    let insertDate : any = DateConvert.getStringToDateTime(dbData[j].INSERT_DATE)

    let timeGap = new Date(0, 0, 0, 0, 0, 0,  updateDate  - insertDate); 
    dbData[j].diffHour = timeGap.getHours();
    dbData[j].diffMin = timeGap.getMinutes();
    dbData[j].diffSec = timeGap.getSeconds();
    ///////////////
  }

  dbData.sort(function (a: any, b: any) { // 최초 가져올 때 학번순으로 배열
    if (a.ADMIN_ID > b.ADMIN_ID) {
        return 1;
    }
    if (a.ADMIN_ID < b.ADMIN_ID) {
        return -1;
    }
    return 0;
  })

  let map = new Map();
  for (let i = 0; i < dbData.length; i++) {
    if (map.has((dbData[i].CUST_CTN))) { // 중복되는 device ID가 있으면
        let pre_history = map.get((dbData[i].CUST_CTN));

        pre_history.push(dbData[i]);
        map.set((dbData[i].CUST_CTN), pre_history);
    } else {
        let array = new Array(dbData[i])
        map.set((dbData[i].CUST_CTN), array);
    }
  }  
  let arr: any = [];
    map.forEach(function (value, key, map) {
    arr.push(value);
  });
  return arr
}

const toDateForm = (_date: string) => {
  let date : string = '';
  if (_date != undefined){
      date = _date.replace(
          /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
          "$1/$2/$3 $4:$5:$6");  // "2012/12/31 02:33:50"
  }
  return date;
}

const deleteYear = (data: string) => {
  let newData: string = '';
  if(data != undefined) {
      newData = data.substr(11)
  }
  return newData;
}

const imgDraw = (ws :any, mergeIdx: number, img_row: number, path: string) => {
  ws.addImage({
    path: path,
    type: 'picture',
    position: {
      type: 'twoCellAnchor',
      from: {
        col: 4,
        colOff: 0,
        row: img_row,
        rowOff: 0
      },
      to: {
        col: 5,
        colOff: 0,
        row: img_row + mergeIdx +1,
        rowOff: 0
      }
    }                            
  })
} 

const getMinInsertDate = (arr : any[]) => {
  let temp : any[] = [];
  for (let item of arr) {
    temp.push(parseInt(item.INSERT_DATE));
  }
  return Math.min.apply(null, temp);
}

const getMaxUpdateDate = (arr : any[]) => {
  let temp : any[] = [];
  for (let item of arr) {
    temp.push(parseInt(item.UPDATE_DATE));
  }
  return Math.max.apply(null, temp);
}