/*  Group ID: 8
    Sam Huang
    Matthew Piazza */

/* Part 1 Create Database (We used the solution to Phase 1) */

/* drop all tables that will be created later 
   give the environment a clean start */
drop table EquipmentUnit;
drop table RoomService;
drop table RoomAccess;
drop table Employee;
drop table Examine;
drop table StayIn;
drop table EquipmentType;
drop table Visit;
drop table Room;
drop table Doctor;
drop table Patient;

/* create all tables */
CREATE TABLE Employee(
empID integer Primary Key,
firstName varchar(20) NOT NULL,
lastName varchar(20) NOT NULL,
salary integer NOT NULL,
jobTitle varchar(40) NOT NULL,
officeNum integer,
empRank integer NOT NULL,
supervisorID integer References Employee(empID),
CONSTRAINT salaryChkEmp CHECK (salary >= 0),
CONSTRAINT officeNumChkEmp CHECK (officeNum > 0),
CONSTRAINT empRankChkEmp CHECK 
((empRank in (0, 1) and supervisorID != NULL) 
or (empRank=2 and supervisorID=NULL)));

CREATE TABLE Room(
roomNum integer Primary Key,
occupiedFlag integer NOT NULL,
CONSTRAINT occupiedChkRoom CHECK (occupiedFlag in (0,1)));

CREATE TABLE RoomService(
roomNum integer References Room(roomNum) ON DELETE CASCADE,
service varchar(20),
CONSTRAINT pkRoomServ Primary Key (roomNum, service));

CREATE TABLE RoomAccess(
roomNum integer References Room(roomNum) ON DELETE CASCADE,
empID integer References Employee(empID) ON DELETE CASCADE,
CONSTRAINT pkRoomAccess Primary Key (roomNum, empID));

CREATE TABLE EquipmentType(
typeID integer Primary Key,
description varchar(100) NOT NULL,
model varchar(10) NOT NULL,
instructions varchar(1000) NOT NULL);

CREATE TABLE EquipmentUnit(
serialNum char(7) Primary Key,
typeID integer NOT NULL References EquipmentType(typeID) ON DELETE CASCADE,
purchaseYear integer NOT NULL,
lastInspection date,
roomNum integer NOT NULL References Room(roomNum));

CREATE TABLE Patient(
patientSSN integer Primary Key,
firstName varchar(20) NOT NULL,
lastName varchar(20) NOT NULL,
address varchar(100),
telNum integer);

CREATE TABLE Doctor(
docID integer Primary Key,
firstName varchar(20) NOT NULL,
lastName varchar(20) NOT NULL,
gender char(6) NOT NULL,
specialty varchar(30),
CONSTRAINT genderChkDoc CHECK (gender in ('Male', 'Female')));

CREATE TABLE Visit(
visitID integer Primary Key,
admitDate date NOT NULL,
leaveDate date,
totalPayment integer NOT NULL,
insurancePayment integer NOT NULL,
patientSSN integer NOT NULL References Patient(patientSSN) ON DELETE CASCADE,
futureVisit date,
CONSTRAINT dateChkVisit CHECK (leaveDate >= admitDate and futureVisit > leaveDate),
CONSTRAINT paymentChkVisit CHECK (totalPayment >= 0 and insurancePayment >= 0 
and insurancePayment <= totalPayment));

CREATE TABLE Examine(
docID integer References Doctor(docID) ON DELETE CASCADE,
visitID integer References Visit(visitID) ON DELETE CASCADE,
docComment varchar(500),
CONSTRAINT pkExamine Primary Key (visitID, docID));

CREATE TABLE StayIn(
visitID integer References Visit(visitID) ON DELETE CASCADE,
roomNum integer References Room(roomNum) ON DELETE CASCADE,
startDate date,
endDate date,
CONSTRAINT pkStayIn Primary Key (visitID, roomNum, startDate),
CONSTRAINT dateChkStayIn CHECK (endDate >= startDate));



/* Part 3 Populate Database */
insert into Employee values (10, 'Grand Master', 'Huang', 85000, 'object manager', 400, 2, NULL);
insert into Employee values (11, 'Black Belt', 'Huang', 80000, 'personnel manager', 401, 2, NULL);
insert into Employee values (12, 'Master', 'Huang', 60000, 'staff manager', 301, 1, 11);
insert into Employee values (13, 'Mentor', 'Huang', 65000, 'maintenance manager', 300, 1, 10);
insert into Employee values (14, 'Expert', 'Huang', 55000, 'requisition manager', 10, 1, 10);
insert into Employee values (15, 'Reknowned', 'Huang', 60000, 'HR manager', 302, 1, 11);
insert into Employee values (16, 'Disciplined', 'Huang', 40000, 'scheduler', 303, 0, 12);
insert into Employee values (17, 'Training', 'Huang', 35000, 'lab technician', 304, 0, 12);
insert into Employee values (18, 'Novice', 'Huang', 10000, 'cashier', 305, 0, 12);
insert into Employee values (19, 'Initiate', 'Huang', 10000, 'cafeteria server', 305, 0, 12);
insert into Employee values (20, 'Acolyte', 'Huang', 20000, 'painter greeter', 306, 0, 13);
insert into Employee values (21, 'Apprentice', 'Huang', 25000, 'handyman', 306, 0, 13);
insert into Employee values (22, 'Determined', 'Huang', 35000, 'hygienic SWAT team', 306, 0, 13);
insert into Employee values (23, 'Welcoming', 'Huang', 15000, 'shipment handler', 10, 0, 14);
insert into Employee values (24, 'Jovial', 'Huang', 15000, 'quartermaster', 10, 0, 14);
insert into Employee values (25, 'Kind', 'Huang', 20000, 'pharmacy technician', 11, 0, 12);

insert into Room values (101, 1);
insert into Room values (102, 1);
insert into Room values (103, 0);
insert into Room values (104, 0);
insert into Room values (105, 0);
insert into Room values (106, 0);
insert into Room values (107, 0);
insert into Room values (108, 0);
insert into Room values (109, 0);
insert into Room values (110, 0);

insert into RoomService values (101, 'emergency room');
insert into RoomService values (102, 'long term care');
insert into RoomService values (103, 'general exam');
insert into RoomService values (103, 'dentistry room');
insert into RoomService values (104, 'general exam');
insert into RoomService values (104, 'dentistry room');
insert into RoomService values (105, 'cancer treatment');
insert into RoomService values (106, 'cancer treatment');
insert into RoomService values (107, 'vision exam');
insert into RoomService values (107, 'hearing exam');
insert into RoomService values (108, 'general exam');
insert into RoomService values (109, 'general exam');
insert into RoomService values (110, 'short term care');

insert into RoomAccess values (101, 10); 
insert into RoomAccess values (102, 10);
insert into RoomAccess values (103, 10);
insert into RoomAccess values (104, 10);
insert into RoomAccess values (105, 10);
insert into RoomAccess values (106, 10);
insert into RoomAccess values (107, 11);
insert into RoomAccess values (108, 11);
insert into RoomAccess values (109, 11);
insert into RoomAccess values (110, 11);
insert into RoomAccess values (101, 12); 
insert into RoomAccess values (102, 12);
insert into RoomAccess values (103, 12);
insert into RoomAccess values (104, 13);
insert into RoomAccess values (105, 13);
insert into RoomAccess values (106, 14);
insert into RoomAccess values (107, 14);
insert into RoomAccess values (108, 15);
insert into RoomAccess values (109, 15);
insert into RoomAccess values (110, 15);

SET SQLBLANKLINES ON
insert into EquipmentType values (1, 'blood pressure monitor', 'ZX2013', 
'hit red power button to turn machine on. wrap strap around bicep of patient. 
velcro in place without tightness. hit green button to activate');

insert into EquipmentType values (2, 'ear light scope', 'E4R11GH7',
'hit red power button to turn machine on. press tip of scope gently ear of 
patient without poking them. look through eyehole');

insert into EquipmentType values (3, 'tongue temperature sensor', 'TTS992X',
'hit red power button to turn machine on. attach new sterile tip to scope.
ask patient to open their mouth and lift their tongue. place scope under 
tongue and ask patient to close their mouth and hold it there. wait 30 
seconds. record temperature. remove scope FROM mouth of patient. detach tip 
and throw it away. turn machine off');
 
insert into EquipmentUnit values ('A01-02X', 1, 2010, TO_DATE('01/01/2015', 'MM/DD/YYYY'), 108);
insert into EquipmentUnit values ('B23-99C', 1, 2010, TO_DATE('01/01/2015', 'MM/DD/YYYY'), 109);
insert into EquipmentUnit values ('201-WYV', 1, 2010, TO_DATE('01/01/2015', 'MM/DD/YYYY'), 110);
insert into EquipmentUnit values ('2H2-XHS', 1, 2010, TO_DATE('01/01/2015', 'MM/DD/YYYY'), 103);
insert into EquipmentUnit values ('23S-D2X', 2, 2011, TO_DATE('01/01/2015', 'MM/DD/YYYY'), 108);
insert into EquipmentUnit values ('83D-54H', 2, 2011, TO_DATE('01/01/2015', 'MM/DD/YYYY'), 109);
insert into EquipmentUnit values ('IO2-DN9', 2, 2010, TO_DATE('01/01/2015', 'MM/DD/YYYY'), 110);
insert into EquipmentUnit values ('675-CNG', 3, 2012, TO_DATE('06/01/2015', 'MM/DD/YYYY'), 108);
insert into EquipmentUnit values ('B3R-093', 3, 2012, TO_DATE('06/01/2015', 'MM/DD/YYYY'), 109);
insert into EquipmentUnit values ('244-1VS', 3, 2012, TO_DATE('06/01/2015', 'MM/DD/YYYY'), 110);

insert into Patient values (111223333, 'Binam', 'Inator', '100 Inst Rd, Worcester, MA, 01609', 8462917483);
insert into Patient values (222334444, 'Cat', 'Cushions', '100 Inst Rd, Worcester, MA, 01609', 9488291234);
insert into Patient values (333445555, 'Gilligan', 'Isles', '100 Inst Rd, Worcester, MA, 01609', 6473823345);
insert into Patient values (444556666, 'Skip', 'Per', '100 Inst Rd, Worcester, MA, 01609', 7482810054);
insert into Patient values (555667777, 'Mary', 'Ann', '100 Inst Rd, Worcester, MA, 01609', 2882249223);
insert into Patient values (666778888, 'The', 'Professor', '100 Inst Rd, Worcester, MA, 01609', 7753992234);
insert into Patient values (777889999, 'Roy', 'Howell', '100 Inst Rd, Worcester, MA, 01609', 8854002123);
insert into Patient values (888991111, 'Ginger', 'Hinkley', '100 Inst Rd, Worcester, MA, 01609', 8854772335);
insert into Patient values (999112222, 'Prince', 'White', '100 Inst Rd, Worcester, MA, 01609', 4565930065);
insert into Patient values (999887777, 'Snow', 'Charming', '100 Inst Rd, Worcester, MA, 01609', 3345885334);

insert into Doctor values (1, 'Pauline', 'OCarrick', 'Female', 'Anesthesiology');
insert into Doctor values (2, 'Thorn', 'Maktig', 'Male', 'Cancer Surgery');
insert into Doctor values (3, 'Stig', 'Olafson', 'Male', 'Dermatology');
insert into Doctor values (4, 'Hal', 'Mikkelson', 'Male', 'Pathology');
insert into Doctor values (5, 'Crowley', 'Gilan', 'Male', 'Hematology');
insert into Doctor values (6, 'Erak', 'Starfollower', 'Male', 'Neurology');
insert into Doctor values (7, 'Horace', 'Altman', 'Male', 'Ophthalmology');
insert into Doctor values (8, 'Alyss', 'Mainwaring', 'Female', 'Dentistry');
insert into Doctor values (9, 'Halt', 'OCarrick', 'Male', 'Pediatrics');
insert into Doctor values (10, 'Will', 'Treaty', 'Male', 'General Surgery');

insert into Visit values (1, TO_DATE('02/05/2015', 'MM/DD/YYYY'), 
TO_DATE('02/05/2015', 'MM/DD/YYYY'), 560, 460, 111223333, NULL);
insert into Visit values (2, TO_DATE('02/23/2015', 'MM/DD/YYYY'), 
TO_DATE('02/23/2015', 'MM/DD/YYYY'), 1500, 1500, 111223333, NULL);
insert into Visit values (3, TO_DATE('03/07/2015', 'MM/DD/YYYY'), 
TO_DATE('03/07/2015', 'MM/DD/YYYY'), 300, 300, 111223333, NULL);
insert into Visit values (4, TO_DATE('03/21/2015', 'MM/DD/YYYY'), 
TO_DATE('03/21/2015', 'MM/DD/YYYY'), 300, 300, 111223333, TO_DATE('03/21/2016', 'MM/DD/YYYY'));
insert into Visit values (5, TO_DATE('10/05/2014', 'MM/DD/YYYY'), 
TO_DATE('10/09/2014', 'MM/DD/YYYY'), 13000, 10000, 222334444, NULL);
insert into Visit values (6, TO_DATE('03/05/2015', 'MM/DD/YYYY'), 
TO_DATE('03/05/2015', 'MM/DD/YYYY'), 200, 200, 333445555, NULL);
insert into Visit values (7, TO_DATE('06/25/2015', 'MM/DD/YYYY'), 
TO_DATE('06/25/2015', 'MM/DD/YYYY'), 100, 0, 444556666, NULL);
insert into Visit values (8, TO_DATE('12/12/2014', 'MM/DD/YYYY'), 
TO_DATE('12/19/2014', 'MM/DD/YYYY'), 8000, 7500, 555667777, NULL);
insert into Visit values (9, TO_DATE('07/23/2015', 'MM/DD/YYYY'), 
TO_DATE('07/23/2015', 'MM/DD/YYYY'), 2300, 2300, 666778888, NULL);
insert into Visit values (10, TO_DATE('02/12/2015', 'MM/DD/YYYY'), 
TO_DATE('02/19/2015', 'MM/DD/YYYY'), 4320, 4320, 777889999, NULL);
insert into Visit values (11, TO_DATE('08/12/2015', 'MM/DD/YYYY'), 
TO_DATE('08/14/2015', 'MM/DD/YYYY'), 1200, 1000, 777889999, TO_DATE('08/14/2016', 'MM/DD/YYYY'));
insert into Visit values (12, TO_DATE('03/17/2015', 'MM/DD/YYYY'), 
TO_DATE('03/17/2015', 'MM/DD/YYYY'), 650, 0, 888991111, NULL);
insert into Visit values (13, TO_DATE('05/02/2015', 'MM/DD/YYYY'), 
TO_DATE('05/02/2015', 'MM/DD/YYYY'), 300, 300, 888991111, NULL);
insert into Visit values (14, TO_DATE('01/07/2015', 'MM/DD/YYYY'), 
TO_DATE('01/10/2015', 'MM/DD/YYYY'), 1200, 1200, 999112222, NULL);
insert into Visit values (15, TO_DATE('10/04/2015', 'MM/DD/YYYY'), NULL, 25000, 25000, 999112222, NULL);
insert into Visit values (16, TO_DATE('05/01/2015', 'MM/DD/YYYY'), 
TO_DATE('05/01/2015', 'MM/DD/YYYY'), 300, 300, 999887777, NULL);
insert into Visit values (17, TO_DATE('05/15/2015', 'MM/DD/YYYY'), 
TO_DATE('05/15/2015', 'MM/DD/YYYY'), 100, 100, 999887777, NULL);
insert into Visit values (18, TO_DATE('11/16/2015', 'MM/DD/YYYY'), NULL, 1200, 1200, 999887777, NULL);

insert into Examine values (4, 1, 'Concerns alleviated, no trace of disease in patient');
insert into Examine values (8, 2, 'Teeth of patient were remarkably well kept. 
New crown added without any complications');
insert into Examine values (8, 3, 'Crown has remained firm. Recommend check-up in two weeks');
insert into Examine values (8, 4, 'Crown has remained firm. Recommend check-up in one year');
insert into Examine values (1, 2, NULL);
insert into Examine values (1, 3, NULL);
insert into Examine values (1, 4, NULL);
insert into Examine values (8, 5, 'Teeth in bad shape, gave strong admonition that patient 
should watch sweets and floss regularly');
insert into Examine values (8, 6, 'Patient has regularly brushed but not flossed. Teeth in 
good shape but could be better if flossed. Watch for future cavities between teeth.');
insert into Examine values (7, 7, 'The eyes of the patient have degraded insignificantly.
Current eye prescription still accurate.');
insert into Examine values (5, 8, 'Blood work returned quickly FROM lab, low white blood count
has been found. Watch for future diseases as patient is vulnerable.');
insert into Examine values (7, 9, 'Patient is developing macular degeneration. Recommending
basic careful preventive measures, but it can only be slowed not stopped.');
insert into Examine values (2, 10, 'Surgery proceeded smoothly and tumors removed. 
Recommend check-up in six months');
insert into Examine values (2, 11, 'Small tumors have come back but were removed as well. 
Patient in good health and has high vitality. Recommend check-up in one year.');
insert into Examine values (9, 12, 'General check up shows patient in good health.');
insert into Examine values (3, 13, 'Mole in question is benign. No further problems.');
insert into Examine values (6, 14, 'Patient had a minor stroke and is recovering smoothly.
Recommend check up in one year.');
insert into Examine values (6, 15, 'Patient underwent massive stroke and is currently in coma.
Being kept on life support as family chooses to continue observing in hospital.');
insert into Examine values (10, 16, 'Patient cut 3 inch gash in their shin running through forest.
Gash closed with stiches. Recommend removal of stitches and check-up in two weeks.');
insert into Examine values (10, 17, 'Stiches removed with no complications');
insert into Examine values (10, 18, 'Patient broke their ankle in unseen hole. Currently
healing in hospital. Recommend one week stay before departing.');

insert into StayIn values (1, 103, TO_DATE('02/05/2015', 'MM/DD/YYYY'), TO_DATE('02/05/2015', 'MM/DD/YYYY'));
insert into StayIn values (2, 104, TO_DATE('02/23/2015', 'MM/DD/YYYY'), TO_DATE('02/23/2015', 'MM/DD/YYYY'));
insert into StayIn values (3, 104, TO_DATE('03/07/2015', 'MM/DD/YYYY'), TO_DATE('03/07/2015', 'MM/DD/YYYY'));
insert into StayIn values (4, 104, TO_DATE('03/21/2015', 'MM/DD/YYYY'), TO_DATE('03/21/2015', 'MM/DD/YYYY'));
insert into StayIn values (5, 103, TO_DATE('10/05/2014', 'MM/DD/YYYY'), TO_DATE('10/09/2014', 'MM/DD/YYYY'));
insert into StayIn values (6, 103, TO_DATE('03/05/2015', 'MM/DD/YYYY'), TO_DATE('03/05/2015', 'MM/DD/YYYY'));
insert into StayIn values (7, 107, TO_DATE('06/25/2015', 'MM/DD/YYYY'), TO_DATE('06/25/2015', 'MM/DD/YYYY'));
insert into StayIn values (8, 108, TO_DATE('12/12/2014', 'MM/DD/YYYY'), TO_DATE('12/12/2014', 'MM/DD/YYYY'));
insert into StayIn values (8, 110, TO_DATE('12/12/2014', 'MM/DD/YYYY'), TO_DATE('12/19/2014', 'MM/DD/YYYY'));
insert into StayIn values (8, 108, TO_DATE('12/19/2014', 'MM/DD/YYYY'), TO_DATE('12/19/2014', 'MM/DD/YYYY'));
insert into StayIn values (9, 107, TO_DATE('07/23/2015', 'MM/DD/YYYY'), TO_DATE('07/23/2015', 'MM/DD/YYYY'));
insert into StayIn values (10, 105, TO_DATE('02/12/2015', 'MM/DD/YYYY'), TO_DATE('02/12/2015', 'MM/DD/YYYY'));
insert into StayIn values (10, 110, TO_DATE('02/12/2015', 'MM/DD/YYYY'), TO_DATE('02/19/2015', 'MM/DD/YYYY'));
insert into StayIn values (10, 109, TO_DATE('02/19/2015', 'MM/DD/YYYY'), TO_DATE('02/19/2015', 'MM/DD/YYYY'));
insert into StayIn values (11, 106, TO_DATE('08/12/2015', 'MM/DD/YYYY'), TO_DATE('08/12/2015', 'MM/DD/YYYY'));
insert into StayIn values (11, 110, TO_DATE('08/12/2015', 'MM/DD/YYYY'), TO_DATE('08/14/2015', 'MM/DD/YYYY'));
insert into StayIn values (11, 108, TO_DATE('08/14/2015', 'MM/DD/YYYY'), TO_DATE('08/14/2015', 'MM/DD/YYYY'));
insert into StayIn values (12, 103, TO_DATE('03/17/2015', 'MM/DD/YYYY'), TO_DATE('03/17/2015', 'MM/DD/YYYY'));
insert into StayIn values (13, 104, TO_DATE('05/02/2015', 'MM/DD/YYYY'), TO_DATE('05/02/2015', 'MM/DD/YYYY'));
insert into StayIn values (14, 101, TO_DATE('01/07/2015', 'MM/DD/YYYY'), TO_DATE('01/08/2015', 'MM/DD/YYYY'));
insert into StayIn values (14, 110, TO_DATE('01/08/2015', 'MM/DD/YYYY'), TO_DATE('01/10/2015', 'MM/DD/YYYY'));
insert into StayIn values (14, 109, TO_DATE('01/10/2015', 'MM/DD/YYYY'), TO_DATE('01/10/2015', 'MM/DD/YYYY'));
insert into StayIn values (15, 101, TO_DATE('10/04/2015', 'MM/DD/YYYY'), TO_DATE('10/05/2015', 'MM/DD/YYYY'));
insert into StayIn values (15, 102, TO_DATE('10/05/2015', 'MM/DD/YYYY'), NULL);
insert into StayIn values (16, 101, TO_DATE('05/01/2015', 'MM/DD/YYYY'), TO_DATE('05/01/2015', 'MM/DD/YYYY'));
insert into StayIn values (17, 104, TO_DATE('05/15/2015', 'MM/DD/YYYY'), TO_DATE('05/15/2015', 'MM/DD/YYYY'));
insert into StayIn values (18, 101, TO_DATE('11/16/2015', 'MM/DD/YYYY'), TO_DATE('11/16/2015', 'MM/DD/YYYY'));
insert into StayIn values (18, 110, TO_DATE('11/16/2015', 'MM/DD/YYYY'), NULL);



/* Part 2 SQL Queries */

/* Q1: Report the room numbers of rooms that are currently occupied. */
SELECT roomNum
FROM Room 
WHERE occupiedFlag=1;

/* Q2: For division manager ID=5, display the IDs, names, and salaries of all regular employees that are
supervised by this manager. */
SELECT empID, firstName, lastName, salary
FROM Employee
WHERE supervisorID=12;

/* Q3: Report the SSN and sum of amounts paid by the insurance company for each patient. */
SELECT patientSSN, sum(insurancePayment) as totalInsurancePayment
FROM Visit
GROUP BY patientSSN
ORDER BY patientSSN;

/* Q4: Report the SSN, first and last name, and the count of visits of each patient. */
SELECT patientSSN, firstName, lastName, visitCount
FROM Patient NATURAL JOIN (
SELECT patientSSN, count(visitID) as visitCount
FROM Visit
GROUP BY patientSSN)
ORDER BY patientSSN;

/* Q5: Report the room number that has an equipment unit with serial number 'A01-02X' */
SELECT roomNum 
FROM EquipmentUnit 
WHERE serialNum='A01-02X';

/* Q6: Report the ID and number of rooms able to be accessed by the employee with access to the most rooms. */
CREATE TABLE Q6(
empID integer Primary Key, 
roomAccessCt integer NOT NULL,
CHECK (roomAccessCt>=0));

insert into Q6(
SELECT empID, count(roomNum) as roomAccessCt
FROM Employee NATURAL JOIN RoomAccess 
GROUP BY empID); 

SELECT empID, roomAccessCt
FROM Q6 NATURAL JOIN (
SELECT max(roomAccessCt) as roomAccessCt
FROM Q6);

drop table Q6;

/* Q7: Report the number of regular employees, division managers, and general managers in the hospital. */
SELECT type, count
FROM (
(SELECT 'Regular employees' as type, count(*) as count
FROM Employee 
WHERE empRank=0)
union
(SELECT 'Division managers' as type, count(*) as count
FROM Employee 
WHERE empRank=1)
union
(SELECT 'General managers' as type, count(*) as count
FROM Employee 
WHERE empRank=2))
ORDER BY count DESC;

/* Q8: Report the SSN, first and last name, and the visit date for patients with a scheduled future visit. */
SELECT patientSSN, firstName, lastName, futureVisit
FROM Patient NATURAL JOIN Visit 
WHERE futureVisit IS NOT NULL;

/* Q9: For each equipment type with more than 3 units, report the equipment type ID, model, and the number 
of units existing of that equipment type. */
SELECT typeID, model, numUnits 
FROM EquipmentType NATURAL JOIN (
SELECT typeID, count(serialNum) as numUnits
FROM EquipmentUnit NATURAL JOIN EquipmentType 
GROUP BY typeID 
HAVING count(serialNum)>3);

/* Q10: Report the date of the coming future visit for patient with SSN=111223333 */
SELECT futureVisit 
FROM Visit 
WHERE patientSSN=111223333 and futureVisit IS NOT NULL;

/* Q11: Report the IDs of doctors who have examined the patient with SSN=11122333 more than 2 times */
SELECT docID 
FROM Visit NATURAL JOIN Examine 
WHERE patientSSN=111223333 
GROUP BY docID 
HAVING count(*)>2;

/* Q12: Report the equipment type IDs for which the hospital has purchased equipment units in both 
2010 and 2011. Do not report duplication. */
SELECT DISTINCT typeID 
FROM EquipmentUnit 
WHERE purchaseYear in (2010, 2011) 
GROUP BY typeID 
HAVING (avg(purchaseYear)>2010 and avg(purchaseYear)<2011);
