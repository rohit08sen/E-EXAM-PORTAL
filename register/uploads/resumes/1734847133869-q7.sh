#Write a shell script to accept name, roll no and four subjects marks and calculate the grade as follows using case statement.
#if avg < 50 then Fail
#else if avg>= 50 and avg < 60 then C
#else if avg >=60 and avg < 70 then B
#else if avg >= 70 and avg < 80 then A
#else if avg >= 80 and avg < 90 then E
#Else O
#-------------------------------------------------------------------------------------------------------------------------------
clear
echo "Enter name: "
read name

echo "Enter RollNo: "
read rollno

echo "Enter the marks of four subjects: "
read s1 s2 s3 s4

x=`expr $s1 + $s2 + $s3 + $s4`
average=`expr $x / 4 `

if [ $average -lt 50 ]; then
    grade="Fail"
elif [ $average -ge 50 ] && [ $average -lt 60 ]; then
    grade="C"
elif [ $average -ge 60 ] && [ $average -lt 70 ]; then
    grade="B"
elif [ $average -ge 70 ] && [ $average -lt 80 ]; then
    grade="A"
elif [ $average -ge 80 ] && [ $average -lt 90 ]; then
    grade="E"
else
    grade="O"
fi

echo "Name: $name"
echo "Roll Number: $rollno"
echo "Average: $average"
echo "Grade: $grade"
