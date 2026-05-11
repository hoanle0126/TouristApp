# TouristWeb Backend API

Backend của TouristWeb dùng NestJS, Prisma và PostgreSQL. Tài liệu này hướng dẫn chạy backend local và test API bằng Postman.

Repo hiện có seed data cho destination, hotel, tour và blog để đồng bộ local nhanh với frontend. Booking thật vẫn được tạo qua flow checkout hoặc API.

## 1. Chuẩn bị môi trường

Cài dependencies:

```bash
npm install
```

Tạo file `.env` trong thư mục `backend`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/touristweb?schema=public"
```

Đổi `USER` và `PASSWORD` theo PostgreSQL local của bạn.

## 2. Khởi tạo database

Lệnh an toàn nhất để đồng bộ schema + seed local là:

```bash
npm run db:sync
```

Lệnh này sẽ:

- apply toàn bộ Prisma migrations đang có trong repo
- chạy seed hiện tại để upsert dữ liệu mẫu/local đang dùng ở frontend

Nếu muốn chạy thủ công từng bước:

Generate Prisma Client:

```bash
npm run prisma:generate
```

Apply migrations:

```bash
npm run prisma:deploy
```

Seed hiện tại sẽ upsert dữ liệu destination, hotel, tour và blog:

```bash
npm run prisma:seed
```

## 3. Chạy backend

```bash
npm run start:dev
```

Base URL mặc định:

```text
http://localhost:8000
```

## 4. Kiểm tra backend

Chạy tests:

```bash
npm test
```

Build backend:

```bash
npm run build
```

## 5. Test bằng Postman

Trong Postman, dùng base URL:

```text
http://localhost:8000
```

Với request `POST` hoặc `PATCH`, thêm header:

```http
Content-Type: application/json
```

Các endpoint `GET /:slug` chỉ test được sau khi bạn đã tạo dữ liệu tương ứng bằng `POST` hoặc nhập từ admin UI sau này.

---

# Tours API

## Tạo tour

```http
POST http://localhost:8000/tours
Content-Type: application/json
```

Body mẫu, thay nội dung bằng dữ liệu thật của khách hàng:

```json
{
  "slug": "tour-slug",
  "title": "Tour title",
  "badge": "Featured",
  "type": "Private",
  "duration": "1 Day",
  "guests": "Max 8 Guests",
  "price": "$120",
  "availability": "Daily",
  "description": ["Tour description."],
  "shortDescription": "Short tour description.",
  "image": "https://example.com/tour-image.jpg",
  "heroImage": "https://example.com/tour-hero.jpg",
  "subtitle": "Tour subtitle.",
  "highlights": [],
  "itinerary": [],
  "gallery": [],
  "inclusions": [],
  "exclusions": []
}
```

## Lấy danh sách tours

```http
GET http://localhost:8000/tours
```

## Lấy chi tiết tour

```http
GET http://localhost:8000/tours/<tour-slug>
```

## Cập nhật tour

```http
PATCH http://localhost:8000/tours/<tour-slug>
Content-Type: application/json
```

```json
{
  "title": "Updated tour title",
  "price": "$135"
}
```

## Xóa tour

```http
DELETE http://localhost:8000/tours/<tour-slug>
```

---

# Destinations API

## Tạo destination

```http
POST http://localhost:8000/destinations
Content-Type: application/json
```

```json
{
  "slug": "destination-slug",
  "title": "Destination title",
  "description": "Destination description.",
  "href": "/destinations/destination-slug",
  "image": "https://example.com/destination-image.jpg",
  "alt": "Destination image alt text",
  "price": "From $99",
  "rating": 4.8,
  "market": "Market name",
  "status": "published",
  "heroImage": "https://example.com/destination-hero.jpg",
  "heroAlt": "Destination hero alt text",
  "summary": "Destination summary.",
  "intro": ["Intro paragraph."],
  "facts": [],
  "spotlight": [],
  "relatedTours": [],
  "relatedHotels": []
}
```

## Lấy danh sách destinations

```http
GET http://localhost:3000/destinations
```

## Filter destinations

```http
GET http://localhost:3000/destinations?market=<market>
GET http://localhost:3000/destinations?search=<keyword>
GET http://localhost:3000/destinations?per_page=2
```

## Lấy chi tiết destination

```http
GET http://localhost:3000/destinations/<destination-slug>
```

## Cập nhật destination

```http
PATCH http://localhost:3000/destinations/<destination-slug>
Content-Type: application/json
```

```json
{
  "title": "Updated destination title"
}
```

## Xóa destination

```http
DELETE http://localhost:3000/destinations/<destination-slug>
```

---

# Hotels API

## Tạo hotel

```http
POST http://localhost:3000/hotels
Content-Type: application/json
```

```json
{
  "slug": "hotel-slug",
  "name": "Hotel name",
  "location": "Hotel location",
  "address": "Hotel address",
  "price": "From $120",
  "badge": "Boutique stay",
  "status": "published",
  "listingImage": "https://example.com/hotel-listing.jpg",
  "listingAlt": "Hotel listing alt text",
  "heroImage": "https://example.com/hotel-hero.jpg",
  "heroAlt": "Hotel hero alt text",
  "description": ["Hotel description."],
  "amenities": [],
  "suites": [],
  "gallery": [],
  "booking": {},
  "destinationSlugs": ["destination-slug"],
  "tourSlugs": ["tour-slug"]
}
```

`destinationSlugs` và `tourSlugs` chỉ dùng được nếu destination/tour tương ứng đã tồn tại.

## Lấy danh sách hotels

```http
GET http://localhost:3000/hotels
```

## Filter hotels

```http
GET http://localhost:3000/hotels?location=<location>
GET http://localhost:3000/hotels?destination=<destination-slug>
GET http://localhost:3000/hotels?tour=<tour-slug>
GET http://localhost:3000/hotels?search=<keyword>
GET http://localhost:3000/hotels?per_page=2
```

## Lấy chi tiết hotel

```http
GET http://localhost:3000/hotels/<hotel-slug>
```

## Cập nhật hotel

```http
PATCH http://localhost:3000/hotels/<hotel-slug>
Content-Type: application/json
```

```json
{
  "name": "Updated hotel name",
  "destinationSlugs": ["destination-slug"],
  "tourSlugs": []
}
```

## Xóa hotel

```http
DELETE http://localhost:3000/hotels/<hotel-slug>
```

---

# Blogs API

## Tạo blog

```http
POST http://localhost:3000/blogs
Content-Type: application/json
```

```json
{
  "slug": "blog-slug",
  "title": "Blog title",
  "excerpt": "Blog excerpt.",
  "category": "Travel Guide",
  "author": "Author name",
  "status": "published",
  "publishedAt": "2026-05-01T09:00:00.000Z",
  "readingTime": "4 min read",
  "image": "https://example.com/blog-image.jpg",
  "alt": "Blog image alt text",
  "heroImage": "https://example.com/blog-hero.jpg",
  "heroAlt": "Blog hero alt text",
  "intro": "Blog intro.",
  "meta": "Blog meta summary.",
  "quote": "Blog quote.",
  "sections": [],
  "inlineImage": {
    "image": "https://example.com/blog-inline.jpg",
    "alt": "Inline image alt text"
  },
  "secondaryFeature": {
    "title": "Feature title",
    "body": "Feature body.",
    "image": {
      "image": "https://example.com/feature.jpg",
      "alt": "Feature image alt text"
    }
  },
  "relatedPosts": [],
  "seo": {
    "title": "SEO title",
    "description": "SEO description."
  },
  "mentionedDestinationSlugs": ["destination-slug"],
  "mentionedTourSlugs": ["tour-slug"],
  "mentionedHotelSlugs": ["hotel-slug"]
}
```

Mention slugs chỉ dùng được nếu destination/tour/hotel tương ứng đã tồn tại.

## Lấy danh sách blogs

```http
GET http://localhost:3000/blogs
```

## Filter blogs

```http
GET http://localhost:3000/blogs?category=<category>
GET http://localhost:3000/blogs?destination=<destination-slug>
GET http://localhost:3000/blogs?tour=<tour-slug>
GET http://localhost:3000/blogs?hotel=<hotel-slug>
GET http://localhost:3000/blogs?search=<keyword>
GET http://localhost:3000/blogs?per_page=1
```

## Lấy chi tiết blog

```http
GET http://localhost:3000/blogs/<blog-slug>
```

## Cập nhật blog

```http
PATCH http://localhost:3000/blogs/<blog-slug>
Content-Type: application/json
```

```json
{
  "title": "Updated blog title",
  "mentionedDestinationSlugs": [],
  "mentionedTourSlugs": ["tour-slug"],
  "mentionedHotelSlugs": ["hotel-slug"]
}
```

## Xóa blog

```http
DELETE http://localhost:3000/blogs/<blog-slug>
```

---

# Bookings API

Booking hoạt động giống orders. Một booking có nhiều booking items. Mỗi item có thể là `tour` hoặc `hotel` và sẽ lưu snapshot dữ liệu tại thời điểm đặt.

## Tạo booking

```http
POST http://localhost:3000/bookings
Content-Type: application/json
```

```json
{
  "fullName": "Customer full name",
  "email": "customer@example.com",
  "phone": "+84 90 000 0000",
  "country": "Country name",
  "city": "City name",
  "address": "Customer address",
  "travelers": 2,
  "primaryTravelerName": "Primary traveler name",
  "primaryTravelerEmail": "primary@example.com",
  "primaryTravelerPhone": "+84 90 000 0000",
  "travelerDetails": {
    "adults": 2,
    "children": 0,
    "travelers": []
  },
  "startDate": "2026-06-12T00:00:00.000Z",
  "endDate": "2026-06-15T00:00:00.000Z",
  "pickupLocation": "Pickup location",
  "dropoffLocation": "Dropoff location",
  "arrivalFlight": "Flight number",
  "specialRequests": "Special requests.",
  "paymentMethod": "credit-card",
  "items": [
    {
      "itemType": "tour",
      "slug": "tour-slug",
      "quantity": 2,
      "date": "2026-06-13",
      "guests": "2 travelers"
    },
    {
      "itemType": "hotel",
      "slug": "hotel-slug",
      "quantity": 1,
      "unitPrice": 390,
      "checkIn": "2026-06-12T00:00:00.000Z",
      "checkOut": "2026-06-15T00:00:00.000Z",
      "guests": "2 travelers",
      "nights": 3,
      "roomType": "Room type",
      "meta": "Room type • 2 travelers"
    }
  ]
}
```

Tour/hotel trong `items` phải tồn tại trước. Response sẽ trả về `bookingCode`.

## Lấy danh sách bookings

```http
GET http://localhost:3000/bookings
```

## Filter bookings

```http
GET http://localhost:3000/bookings?email=<email>
GET http://localhost:3000/bookings?status=pending
GET http://localhost:3000/bookings?payment_status=pending
GET http://localhost:3000/bookings?per_page=5
```

## Lấy chi tiết booking

```http
GET http://localhost:3000/bookings/<bookingCode>
```

## Cập nhật trạng thái booking

```http
PATCH http://localhost:3000/bookings/<bookingCode>/status
Content-Type: application/json
```

```json
{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

Giá trị hợp lệ:

- `status`: `pending`, `confirmed`, `cancelled`, `completed`, `review`
- `paymentStatus`: `pending`, `paid`, `failed`, `refunded`
- `paymentMethod`: `credit-card`, `bank-transfer`, `apple-pay`, `cash`

## 6. Thứ tự test đề xuất

1. Tạo destination bằng `POST /destinations`.
2. Tạo tour bằng `POST /tours`.
3. Tạo hotel bằng `POST /hotels`, truyền `destinationSlugs` và/hoặc `tourSlugs` nếu muốn liên kết.
4. Tạo blog bằng `POST /blogs`, truyền mention slugs nếu muốn liên kết editorial.
5. Tạo booking bằng `POST /bookings`, dùng slug của tour/hotel đã tạo.
6. Copy `bookingCode` trong response.
7. Test `GET /bookings/<bookingCode>`.
8. Test `PATCH /bookings/<bookingCode>/status`.
