import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from '~/models/user.model';  
import Booking from '~/models/booking.model';  
import Review from '~/models/review.model';  
import Faq from '~/models/faq.model';  
import Coupon from '~/models/coupon.model';  
import Car from '~/models/car.model';  

// Hàm chính để tạo dữ liệu giả lập
const generateFakeData = async () => {
  // Kết nối tới MongoDB
  await mongoose.connect('mongodb://localhost:27017/go-rental');  // Điều chỉnh URL và tên cơ sở dữ liệu

  // Xóa dữ liệu cũ
  await User.deleteMany({});
  await Booking.deleteMany({});
  await Review.deleteMany({});
  await Faq.deleteMany({});
  await Coupon.deleteMany({});

  // Lấy dữ liệu của tất cả các xe
  const cars = await Car.find();

  // Tạo 30 user
  const users: any = [];
  for (let i = 0; i < 30; i++) {
    const user = new User({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: '123456',
      phoneNo: faker.phone.number(),
      role: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await user.save();
    users.push(user);
  }

  // Tạo 8 booking và review cho mỗi user
  const reviews: any[] = [];  // Chứa các review đã tạo để gán cho cars
  for (const user of users) {
    for (let i = 0; i < 8; i++) {
      const car = cars[faker.number.int({ min: 0, max: cars.length - 1 })];
      
      const startDate = faker.date.future();
      const endDate = faker.date.future({ refDate: startDate });

      const booking = new Booking({
        user: user._id,
        car: car._id,
        startDate,
        endDate,
        customer: {
          name: user.name,
          email: user.email,
          phoneNo: user.phoneNo,
        },
        amount: {
          rent: car.rentPerDay,
          discount: faker.number.int({ min: 0, max: 10 }),
          tax: faker.number.int({ min: 5, max: 15 }),
          total: car.rentPerDay * 8,
        },
        daysOfRent: 8,
        rentPerDay: car.rentPerDay,
        paymentInfo: {
          id: faker.string.uuid(),
          status: 'paid',
          method: 'card',
        },
        additionalNotes: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await booking.save();

      const review = new Review({
        user: user._id,
        car: car._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentences(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await review.save();
      reviews.push(review._id);  // Lưu lại ID của review để gán cho car
    }
  }

  // Gán reviews vào bảng car
  for (const car of cars) {
    // Chỉ gán reviews cho những xe đã có ít nhất 1 review
    const carReviews = reviews.slice(0, faker.number.int({ min: 5, max: 15 }));
    car.reviews = carReviews;
    await car.save();
  }

// Tạo chỉ 5 FAQ cho toàn bộ hệ thống
for (let i = 0; i < 5; i++) {
  const faq = new Faq({
    user: users[faker.number.int({ min: 0, max: users.length - 1 })]._id, // Chọn ngẫu nhiên user cho mỗi FAQ
    question: faker.lorem.sentence(),
    answer: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await faq.save();
}

  // Tạo 20 phiếu giảm giá cho bảng car
  for (let i = 0; i < 20; i++) {
    const car = cars[faker.number.int({ min: 0, max: cars.length - 1 })];
    const coupon = new Coupon({
      user: users[faker.number.int({ min: 0, max: users.length - 1 })]._id,
      car: car._id,
      name: faker.commerce.productName(),
      code: faker.string.alphanumeric(10).toUpperCase(),
      discountPercent: faker.number.int({ min: 5, max: 30 }),
      expiry: faker.date.future(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await coupon.save();
  }

  console.log("Fake data generated successfully!");
  await mongoose.disconnect();
};

generateFakeData().catch((error) => console.error(error));
