import type { HotelDetail } from "@/src/types/travel";

export type HotelCommercialStatus = "Draft" | "Ready for review" | "Published";
export type HotelAmenityIcon = "pool" | "spa" | "dining" | "gym" | "wifi" | "coffee" | "parking" | "beach";
export type InventoryStatus = "open" | "closed";

export interface AdminHotelInventoryFormRow {
  readonly id?: string;
  readonly rowId: string;
  readonly date: string;
  readonly totalRooms: string;
  readonly bookedRooms: string;
  readonly status: InventoryStatus;
}

export interface HotelFormState {
  readonly name: string;
  readonly slug: string;
  readonly location: string;
  readonly price: string;
  readonly badge: string;
  readonly status: HotelCommercialStatus;
  readonly listingImage: string;
  readonly heroImage: string;
  readonly address: string;
  readonly bookingCheckIn: string;
  readonly bookingCheckOut: string;
  readonly bookingFee: string;
  readonly bookingNightlyTotal: string;
  readonly bookingNights: string;
  readonly bookingRating: string;
  readonly bookingTravelers: string;
  readonly bookingTotal: string;
  readonly destinationSlug: string;
}

export interface HotelTextRow {
  readonly id: string;
  readonly value: string;
}

export interface HotelAmenityRow {
  readonly id: string;
  readonly icon: HotelAmenityIcon;
  readonly title: string;
}

export interface HotelSuiteRow {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly badge: string;
  readonly description: string;
  readonly image: string;
}

export interface HotelGalleryRow {
  readonly id: string;
  readonly image: string;
}

export interface HotelFormInitialValues {
  readonly form: HotelFormState;
  readonly inventory: readonly AdminHotelInventoryFormRow[];
  readonly amenities: readonly HotelAmenityRow[];
  readonly description: readonly HotelTextRow[];
  readonly suites: readonly HotelSuiteRow[];
  readonly gallery: readonly HotelGalleryRow[];
}

export interface ResolvedAdminHotelEditData {
  readonly hotelName: string;
  readonly initialValues: HotelFormInitialValues;
}

export const hotelStatusOptions: readonly HotelCommercialStatus[] = ["Draft", "Ready for review", "Published"];

export function createEmptyAmenity(id: string): HotelAmenityRow {
  return {
    id,
    icon: "pool",
    title: "",
  };
}

export function createEmptySuite(id: string): HotelSuiteRow {
  return {
    id,
    name: "",
    price: "",
    badge: "",
    description: "",
    image: "",
  };
}

export function createEmptyGalleryImage(id: string): HotelGalleryRow {
  return {
    id,
    image: "",
  };
}

export const createHotelInitialValues: HotelFormInitialValues = {
  form: {
    name: "",
    slug: "",
    location: "",
    price: "",
    badge: "",
    status: "Draft",
    listingImage: "",
    heroImage: "",
    address: "",
    bookingCheckIn: "",
    bookingCheckOut: "",
    bookingFee: "",
    bookingNightlyTotal: "",
    bookingNights: "",
    bookingRating: "",
    bookingTravelers: "",
    bookingTotal: "",
    destinationSlug: "",
  },
  inventory: [
    {
      rowId: "inventory-1",
      date: "",
      totalRooms: "",
      bookedRooms: "0",
      status: "open",
    },
  ],
  amenities: [createEmptyAmenity("amenity-1"), createEmptyAmenity("amenity-2")],
  description: [
    { id: "description-1", value: "" },
    { id: "description-2", value: "" },
  ],
  suites: [createEmptySuite("suite-1")],
  gallery: [createEmptyGalleryImage("gallery-1")],
};

export function slugifyHotelName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function textRows(prefix: string, values: readonly string[]) {
  if (values.length === 0) {
    return [{ id: `${prefix}-1`, value: "" }];
  }

  return values.map((value, index) => ({ id: `${prefix}-${index + 1}`, value }));
}

export function valuesFromHotelDetail(detail: HotelDetail): ResolvedAdminHotelEditData {
  const slug = detail.slug ?? slugifyHotelName(detail.title);

  return {
    hotelName: detail.title,
    initialValues: {
      form: {
        name: detail.title,
        slug,
        location: detail.location,
        price: detail.price,
        badge: "",
        status: "Published",
        listingImage: detail.heroImage,
        heroImage: detail.heroImage,
        address: detail.address,
        bookingCheckIn: detail.booking.checkIn,
        bookingCheckOut: detail.booking.checkOut,
        bookingFee: detail.booking.fee,
        bookingNightlyTotal: detail.booking.nightlyTotal,
        bookingNights: String(detail.booking.nights),
        bookingRating: String(detail.booking.rating),
        bookingTravelers: detail.booking.travelers,
        bookingTotal: detail.booking.total,
        destinationSlug: detail.destinations[0]?.slug ?? "",
      },
      inventory: detail.inventory.length > 0 ? detail.inventory.map((day, index) => ({
        id: day.id,
        rowId: `inventory-${index + 1}`,
        date: day.date,
        totalRooms: String(day.totalRooms),
        bookedRooms: String(day.bookedRooms),
        status: day.status,
      })) : [{ rowId: "inventory-1", date: "", totalRooms: "", bookedRooms: "0", status: "open" }],
      amenities: detail.amenities.length > 0 ? detail.amenities.map((amenity, index) => ({
        id: `amenity-${index + 1}`,
        icon: amenity.icon,
        title: amenity.title,
      })) : [createEmptyAmenity("amenity-1")],
      description: textRows("description", detail.description),
      suites: detail.suites.map((suite, index) => ({
        id: `suite-${index + 1}`,
        name: suite.name,
        price: suite.price,
        badge: suite.badge ?? "",
        description: suite.description,
        image: suite.image,
      })),
      gallery: detail.gallery.map((image, index) => ({
        id: `gallery-${index + 1}`,
        image: image.image,
      })),
    },
  };
}
