var dateModule = {};

dateModule.getcurrdate = (timezone) => {
    var currdate = new Date();
    var currday = currdate.toLocaleDateString('en-US', {day: '2-digit', timeZone: timezone});
    var currmonth = currdate.toLocaleDateString('en-US',{month: '2-digit', timeZone: timezone});
    var curryear = currdate.toLocaleDateString('en-US', {year: 'numeric', timeZone: timezone});
    return [curryear, currmonth, currday].join('-');
}

dateModule.addDate = (date, offset) => {
    let newdate = new Date(date);
    newdate.setDate(newdate.getDate() + offset);
    return newdate.toISOString().slice(0,10);
}

dateModule.StringtoDatetime = (date, time, timezone) => {
    let utc = '';
    let sym = '+';
    if(timezone <= 0) sym = '-';
    // console.log(timezone <= 9 && timezone >= -9);
    if(timezone <= 9 && timezone >= -9){
        utc = sym + '0' + Math.abs(timezone) + '00';
        // console.log(utc);
    } else {
        utc = sym + Math.abs(timezone) + '00';
    }
    // console.log(date + 'T' + time + utc);
    // console.log(new Date(date + 'T' + time + utc).toString());
    return new Date(date + 'T' + time + utc);
}

dateModule.parseDuration = (duration) => {
    let remain = duration
  
    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
  
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
  
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
  
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
  
    let milliseconds = remain;
  
    return {days,hours,minutes,seconds,milliseconds};
}

dateModule.formatTime = (duration, useMilli = false) => {
    let parts = [];
    if (duration.days) {
      let ret = duration.days + 'd';
      parts.push(ret);
    }
    if (duration.hours) {
      let ret = duration.hours + 'h';
      parts.push(ret);
    }
    if (duration.minutes) {
      let ret = duration.minutes + 'm';
      parts.push(ret);
  
    }
    if (duration.seconds) {
      let ret = duration.seconds + 's';
      parts.push(ret)
    }
    if (useMilli && duration.milliseconds) {
      let ret = duration.milliseconds + 'ms';
      parts.push(ret);
    }

    if (parts.length === 0) {
      return '0m';
    } else {
      return parts.join(' ');
    }
}

module.exports = dateModule;