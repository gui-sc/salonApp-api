import { Request, Response } from "express";
import { ZodError } from "zod";
import MongoDBService from "../services/MongoDBService";
import { Schedule } from "../types/schedule";
import { createScheduleSchema, getSchedulesSchema } from "../schemas/scheduleSchema";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import { getAllSchedules } from "../helpers/scheduleHelper";
import { getAndDeleteSchema } from "../schemas/uniqueSchema";

export async function index(req: Request, res: Response) {
    try {
        while (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const { params } = await getSchedulesSchema.parseAsync(req);

        const scheduleColl = MongoDBService.db.collection<Schedule>("schedules");
        const schedules = await scheduleColl.find({
            dateTime: {
                $gte: params.date.startOf("day").toDate(),
                $lte: params.date.endOf("day").toDate()
            }
        }).toArray();

        return res.status(200).json({ schedules });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            res.status(400).json({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function create(req: Request, res: Response) {
    try {
        while (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const { body } = await createScheduleSchema.parseAsync(req);

        const scheduleColl = MongoDBService.db.collection<Schedule>("schedules");
        const time = body.hour.split(":");
        const date = dayjs(body.date).set("hour", parseInt(time[0])).set("minute", parseInt(time[1]));

        const occupiedTimes = await getAvailables(date, false);
        if (occupiedTimes.includes(date.format("HH:mm"))) {
            return res.status(400).json({ message: "Time not available" });
        }

        await scheduleColl.insertOne({
            dateTime: date.toDate(),
            price: body.price,
            professionalId: new ObjectId(body.professionalId),
            serviceId: new ObjectId(body.serviceId),
            userId: new ObjectId(body.userId),
            time: body.time
        });

        return res.status(201).json({ message: "Schedule created" });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function showAvailables(req: Request, res: Response) {
    try {
        while (!MongoDBService.booted) {
            await MongoDBService.boot();
        }

        const { params } = await getSchedulesSchema.parseAsync(req);

        const availableTimes = await getAvailables(params.date, true);

        return res.status(200).json({ availableTimes });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        await MongoDBService.close();
    }
}

export async function remove(req: Request, res: Response) {
    try {
        while (!MongoDBService.booted) {
            await MongoDBService.boot();
        }
        const { params } = await getAndDeleteSchema.parseAsync(req);
        const scheduleColl = MongoDBService.db.collection<Schedule>("schedules");
        const schedule = await scheduleColl.findOne({ _id: new ObjectId(params.id) });
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        await scheduleColl.deleteOne({ _id: new ObjectId(params.id) });
        return res.status(200).json({ message: "Schedule removed" });
    } catch (error) {
        console.error(error);
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.errors.map(err => err.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        await MongoDBService.close();
    }
}

async function getAvailables(date: dayjs.Dayjs, available: boolean): Promise<string[]> {
    const scheduleColl = MongoDBService.db.collection<Schedule>("schedules");
    const schedules = await scheduleColl.find({
        dateTime: {
            $gte: date.startOf("day").toDate(),
            $lte: date.endOf("day").toDate()
        },
    }).toArray();

    const availableSchedules: string[] = getAllSchedules();
    const schedulesTimes = schedules.map(schedule => {
        const schedules = [];
        const initialDate = dayjs(schedule.dateTime);
        const times = Math.ceil(schedule.time / 30);
        for (let i = 0; i < times; i++) {
            schedules.push(initialDate.add(30 * i, "minute").format("HH:mm"));
        }
        return schedules;
    }).flat();
    const availableTimes = availableSchedules.filter(time => {
        if (available) {
            return !schedulesTimes.includes(time);
        }
        return schedulesTimes.includes(time);
    });
    return availableTimes;
}