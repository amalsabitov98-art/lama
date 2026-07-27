import 'package:turon_tour/domain/entities/localized.dart';

/// A bookable tour (domain view of the `Tours` table).
class Tour {
  const Tour({
    required this.id,
    required this.title,
    required this.shortDescription,
    required this.fullDescription,
    required this.aiSummary,
    required this.images,
    required this.highlights,
    required this.included,
    required this.excluded,
    required this.meetingLat,
    required this.meetingLng,
    required this.meetingAddress,
    required this.meetingPhoto,
    required this.retailPrice,
    required this.netPrice,
    required this.currency,
    required this.rating,
    required this.reviewsCount,
    required this.durationDays,
    required this.category,
    required this.region,
  });

  final int id;
  final LocalizedText title;
  final LocalizedText shortDescription;
  final LocalizedText fullDescription;
  final LocalizedText aiSummary;
  final List<String> images;
  final LocalizedList highlights;
  final LocalizedList included;
  final LocalizedList excluded;
  final double meetingLat;
  final double meetingLng;
  final LocalizedText meetingAddress;
  final String meetingPhoto;
  final double retailPrice;
  final double netPrice;
  final String currency;
  final double rating;
  final int reviewsCount;
  final int durationDays;
  final String category;
  final String region;

  String get coverImage => images.isNotEmpty ? images.first : '';
}

/// A scheduled group departure for a tour.
class TourDeparture {
  const TourDeparture({
    required this.id,
    required this.tourId,
    required this.departureDate,
    required this.totalSeats,
    required this.seatsLeft,
    required this.status,
    required this.pricePerPerson,
  });

  final int id;
  final int tourId;
  final DateTime departureDate;
  final int totalSeats;
  final int seatsLeft;
  final String status; // recruiting / confirmed / closed
  final double pricePerPerson;

  bool get almostFull => seatsLeft > 0 && seatsLeft <= 5;
  bool get soldOut => seatsLeft <= 0;
}

/// A review left on a tour.
class TourReview {
  const TourReview({
    required this.id,
    required this.author,
    required this.rating,
    required this.body,
    required this.date,
  });

  final int id;
  final String author;
  final double rating;
  final String body;
  final DateTime date;
}

/// A tour together with its departures and reviews.
class TourDetails {
  const TourDetails({
    required this.tour,
    required this.departures,
    required this.reviews,
  });

  final Tour tour;
  final List<TourDeparture> departures;
  final List<TourReview> reviews;
}
