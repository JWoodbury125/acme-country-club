const Sequelize = require('sequelize')
const sequelize = new Sequelize( process.env.DATABASE_URL || 'postgres://localhost/acme_country_club')
const UUID = Sequelize.UUID
const UUIDV4 = Sequelize.UUIDV4


const Member = sequelize.define('member', {
    name: {
        type: Sequelize.STRING(20),
        unique: true,
        validation: {
            notEmpty: true
        }
    },
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    }
})
const Facility = sequelize.define('facility', {
    name: {
        type: Sequelize.STRING(20),
        unique: true,
        validation: {
            notEmpty: true
        }
    },
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    }
})

const Booking = sequelize.define('booking', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    }
})

Member.belongsTo(Member, {as: 'sponsor'})
Booking.belongsTo(Member, {as: 'booker'})
Booking.belongsTo(Facility)
Member.hasMany(Booking, {foreignKey: 'bookerId'})
Facility.hasMany(Booking)


const syncAndSeed = async () => {
    try{
        await sequelize.sync( {force: true})
        console.log('Connected To DB')
        const lucy = await Member.create({name: 'lucy'})
        const moe = await Member.create({name: 'moe', sponsorId: lucy.id})
        const larry = await Member.create({name: 'larry', sponsorId: lucy.id})
        const ethyl = await Member.create({name: 'ethyl', sponsorId: moe.id})
        const tennis = await Facility.create({name: 'tennis'})
        const pingpong = await Facility.create({name: 'pingpong'})
        const marbles = await Facility.create({name: 'marbles'}) 
        await Booking.create({bookerId: lucy.bookerId, facilityId: marbles.id})
        await Booking.create({bookerId: lucy.bookerId, facilityId: marbles.id})
        await Booking.create({bookerId: moe.bookerId, facilityId: tennis.id})
    }
    catch(ex){
        console.log(ex)
    }

}
syncAndSeed()

module.exports = { sequelize, Member, Facility, Booking, syncAndSeed}