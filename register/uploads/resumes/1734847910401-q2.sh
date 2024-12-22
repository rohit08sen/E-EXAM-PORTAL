#Write a shell script to find the sum and average of the four integers entered from the keyboard.
#------------------------------------------------------------------------------------------------
clear
echo "Enter four numbers: "
read n1 n2 n3 n4
c=`expr $n1 + $n2 + $n3 + $n4`
a=`expr $c / 4`
echo "sum:$c Avg:$a"
