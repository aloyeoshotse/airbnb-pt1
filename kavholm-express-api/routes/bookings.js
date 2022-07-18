const express = require("express")
const Booking = require("../models/booking")
const security = require("../middleware/security")
const permissions = require("../middleware/permissions")
const router = express.Router()


router.post("bookings/listings/:listingId/", security.requireAuthenticatedUser,
  permissions.authedUserIsListingOwner, async (req, res, next) => {
    try {
      console.log("locals = ", res.locals)
      console.log("reqbody = ", req.body)
      const user = res.locals.user
      const listing = res.locals.listing
      const newBooking = req.body
      console.log("newBooking : ", newBooking); 
      const booking = Booking.createBooking({newBooking, listing, user})
      return res.json(201).json(booking)
    }
    catch(error) {
      next(error)
    }
} )

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    // list all bookings created by authenticated user
    const { user } = res.locals
    const bookings = await Booking.listBookingsFromUser(user)
    return res.status(200).json({ bookings })
  } catch (err) {
    next(err)
  }
})

router.get("/listings", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    // list all bookings created for any user-owned listings
    const { user } = res.locals
    const bookings = await Booking.listBookingsForUserListings(user)
    return res.status(200).json({ bookings })
  } catch (err) {
    next(err)
  }
})

router.get(
  "/listings/:listingId/",
  security.requireAuthenticatedUser,
  permissions.authedUserIsListingOwner,
  async (req, res, next) => {
    try {
      // list all bookings for a single listing
      const { listing } = res.locals
      const bookings = await Booking.listBookingsForListing(listing.id)
      return res.status(200).json({ bookings })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
