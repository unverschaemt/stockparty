var assert = require('assert'); // node.js core module
var mongoose = require('mongoose');
var userInterface = require('../database/UserInterface');
var drinkInterface = require('../database/DrinkInterface');
var guestInterface = require('../database/GuestInterface');
var alcoholInterface = require('../database/AlcoholLevelInterface');
var consumptionInterface = require('../database/ConsumptionInterface');
var priceHistoryInterface = require('../database/PriceHistoryInterface');

// Create db connection
var db;

describe('Database', function(){
    
    before(function(done){
        db = mongoose.connect('mongodb://localhost/stockparty');
        done();
    })
    
    describe('User Interface', function(){
        var userToCreate = {'userName': 'UserName', 'password': 'Password', 'name': 'Name', 'role': {'role': 'role'}};
        
        afterEach(function(done){
            userInterface.deleteUser(userToCreate.userName, function error(err){}, function cb(obj){
                done();    
            });
        })
      
        it('should add a user to database', function(done){
            userInterface.addUser(userToCreate.userName, userToCreate.password, userToCreate.name, userToCreate.role, function cb(){

                userInterface.getUser(userToCreate.userName, function error(err){}, function cb(obj){
                    assert.equal(userToCreate.userName, obj.userName);
                    assert.equal(userToCreate.password, obj.password);
                    assert.equal(userToCreate.name, obj.name);
                    assert.deepEqual(userToCreate.role, obj.role);
                    done();}
                );
            });
        })

        it('should change the password of an user', function(done){
            userInterface.addUser(userToCreate.userName, userToCreate.password, userToCreate.name, userToCreate.role, function cb(){

                var userInformation = {'password': 'NewPassword'};
                userInterface.setUserInfo(userToCreate.userName, userInformation, function error(err){}, function cb(obj){
                    userInterface.getUser(userToCreate.userName, function error(err){}, function cb(obj){
                        assert.equal(userInformation.password, obj.password);
                        done();}
                    );}
                );
            });
        })
        
        it('should delete an user', function(done){
            userInterface.addUser(userToCreate.userName, userToCreate.password, userToCreate.name, userToCreate.role, function cb(){

                userInterface.deleteUser(userToCreate.userName, function error(err){}, function cb(obj){
                    userInterface.getUser(userToCreate.userName, function error(err){}, function cb(obj){
                        assert.equal(obj, null);
                        done();}
                    );}
                );
            });
        })
    })
    
    describe('Guest Interface', function(){
        var guestToCreate = {'idk': 'f23ab47c','balance': 5.00, 'name': 'Name', 'birthDate': 12.12};
        
        afterEach(function(done){
            guestInterface.deleteAllGuests(function error(err){}, function cb(obj){
                done();    
            });
        })
      
        it('should add a guest to database', function(done){
            guestInterface.addGuest(guestToCreate.idk, guestToCreate.balance, guestToCreate.name, guestToCreate.birthDate, function error(err){}, function cb(){
                guestInterface.getGuest(guestToCreate.idk, function error(err){}, function cb(obj){
                    assert.equal(guestToCreate.idk, obj.idk);
                    assert.equal(guestToCreate.balance, obj.balance);
                    assert.equal(guestToCreate.name, obj.name);
                    assert.equal(guestToCreate.birthDate, obj.birthDate);
                    done();}
                );
            });
        })
        
        it('should not add two guests with the same idk', function(done){
            guestInterface.addGuest(guestToCreate.idk, guestToCreate.balance, guestToCreate.name, guestToCreate.birthDate, function error(err){}, function cb(){
                guestInterface.addGuest(guestToCreate.idk, guestToCreate.balance, guestToCreate.name, guestToCreate.birthDate, function error(err){ 
                    done();
                }, function cb(){});
            });
        })
        
        it('should add a guest, even if it has no idk', function(done){
            guestInterface.addGuest('', guestToCreate.balance, guestToCreate.name, guestToCreate.birthDate, function error(err){}, function cb(){
                guestInterface.getGuest('', function error(err){}, function cb(obj){
                    assert.equal('', obj.idk);
                    assert.equal(guestToCreate.balance, obj.balance);
                    assert.equal(guestToCreate.name, obj.name);
                    assert.equal(guestToCreate.birthDate, obj.birthDate);
                    done();
                });
            });
        })

        it('should add balance to a guest', function(done){
            guestInterface.addGuest(guestToCreate.idk, guestToCreate.balance, guestToCreate.name, guestToCreate.birthDate, function error(err){}, function cb(){

                var balanceToAdd = 10;
                guestInterface.setGuestBalance(guestToCreate.idk, balanceToAdd, function error(err){}, function cb(obj){
                    guestInterface.getGuest(guestToCreate.idk, function error(err){}, function cb(obj){
                        assert.equal(guestToCreate.balance + balanceToAdd, obj.balance);
                        done();}
                    );}
                );
            });
        })
        
        it('should delete a guest', function(done){
            guestInterface.addGuest(guestToCreate.idk, guestToCreate.balance, guestToCreate.name, guestToCreate.birthDate, function error(err){}, function cb(){

                guestInterface.deleteGuest(guestToCreate.idk, function error(err){}, function cb(obj){
                    guestInterface.getGuest(guestToCreate.idk, function error(err){}, function cb(obj){
                        assert.equal(obj, null);
                        done();}
                    );}
                );
            });
        })
        it('should delete all guests', function(done){
            var differentGuestToCreate = {'idk': 'f23ab47d','balance': 7.00, 'name': 'Name', 'birthDate': 12.12};

            guestInterface.addGuest(guestToCreate.idk, guestToCreate.balance, guestToCreate.name, guestToCreate.birthDate, function error(err){}, function cb(){
                guestInterface.addGuest(differentGuestToCreate.idk, differentGuestToCreate.balance, differentGuestToCreate.name, differentGuestToCreate.birthDate, function error(err){}, function cb(){

                    guestInterface.deleteAllGuests(function error(err){}, function cb(obj){
                        guestInterface.getGuest(guestToCreate.idk, function error(err){}, function cb(obj){
                            assert.equal(obj, null);
                            guestInterface.getGuest(differentGuestToCreate.idk, function error(err){}, function cb(obj){
                                assert.equal(obj, null);
                                done();}
                            );}       
                        );}
                    );
                });
            });
        })
    })
})  