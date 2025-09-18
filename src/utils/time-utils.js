/**
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

//returns a string that states how many seconds, minutes, .. , years has passed since the given date
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffSec = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffSec / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

//returns a string that states how much minutes, hours, ... years passed given the duration in seconds
export const getDurationTimeString = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year` + (years > 1 ? "s" : "");
  if (months > 0) return `${months} month` + (months > 1 ? "s" : "");
  if (days > 0) return `${days} day` + (days > 1 ? "s" : "");
  if (hours > 0) return `${hours} ` + (hours > 1 ? "hours" : "hour");
  if (mins > 0) return `${mins} min` + (mins > 1 ? "s" : "");

  return `${seconds} second` + (seconds > 1 ? "s" : "");
};
