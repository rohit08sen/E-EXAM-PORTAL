#Write a shell script to find whether a given number is even or odd.
#-------------------------------------------------------------------
clear 
echo "Enter a number: "
read num
r=$(expr $num % 2)
if [ $r -eq 0 ]; then
    echo "Even"
else
    echo "Odd"
fi

