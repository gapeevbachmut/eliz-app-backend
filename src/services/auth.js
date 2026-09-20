// src/services/auth.js

import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};
/**
- crypto.randomUUID() - генерує унікальний рядок.
- accessToken живе недовго — це зменшує ризики у випадку витоку.
- refreshToken живе довше та використовується для отримання нової пари токенів.
 */

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};

/**
- httpOnly: true — браузер не дає доступу до куки з JS (через document.cookie). Зменшує ризик витоку токенів через XSS.
- secure: true — браузер надсилає таку куку лише через HTTPS. У продакшні це must-have; у дев-режимі без HTTPS такі куки не приліпнуть.
- sameSite: 'none' — дозволяє надсилати куку у крос-доменних запитах (коли фронтенд і бекенд на різних доменах/порталах). Важливо: SameSite=None вимагає secure: true.
- Для довідки: lax частково дозволяє крос-сайт (наприклад, при навігації за посиланням), strict — найжорсткіший варіант (тільки свій сайт).
- maxAge — час життя у мілісекундах. Після спливу браузер перестає надсилати куку.
 */
