
'use strict';

export function randomStr(len = 10)
{
  return Math.random()
             .toString(36)
             .replace(/[^a-z]+/g, '')
             .substr(0, len);
}

