import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class Purchase {
  constructor(
    public id: number,
    public date: Date,
    public userId: number,
    public eventId: number,
    public ticketsCount: number,
    public user?: any,
    public event?: any
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseAdapter implements Adapter<Purchase> {

  input(item: any): Purchase {
    return new Purchase(
      item.id,
      (item.date ? new Date(item.date) : item.date),
      (item.userId ? +item.userId : item.userId),
      (item.eventId ? +item.eventId : item.eventId),
      item.ticketsCount,
      (item.user ? item.user : undefined),
      (item.event ? item.event : undefined)
    );
  }

  output(item: Purchase): any {
    return {
      id: item.id,
      date: (item.date ? item.date.toISOString() : item.date),
      userId: item.userId,
      eventId: item.eventId,
      ticketsCount: item.ticketsCount
    };
  }

}
