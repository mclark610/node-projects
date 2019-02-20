#!/usr/bin/perl 
#-------------------------------------------------------------
# create_data creates test data for maintain,parts,todo,notes
# table in maintain database.  sql inserts are returned.
# ------------------------------------------------------------
use strict;
use warnings;

use File::Slurp;
use Data::Dumper qw(Dumper);


use Text::Lorem;
 
my $text = Text::Lorem->new();


my @maintain;
my @todo;
my @part;
my @note;


sub fillMaintain {
    my @line = read_file("./stuff.txt",chomp=>1) or die("fillMaintains::read_file issue");

    my @arr;
    my $pos=0;
    foreach(@line) {
        my $name = $_ =~ s/^\s+|\s+//g;
        my $desc = $text->paragraphs(1);
	my $sts  ="active";
	my $complete ="false";
	my $createdAt = "2019-01-17";
        $pos++;

my $line = <<"END_LINE";
insert into maintain (id,name,description,status,complete,createdAt) 
values(
    $pos,
    '$name',
    '$desc',
    '$sts',
    '$complete',
    '$createdAt'
);
END_LINE

	push(@arr,$line);
    }
    
    return @arr;
}

sub fillTodo {
    my $maxTodo=55;
    my @arr;
    my $maxMaintainId=scalar(@maintain);

    for(my $pos=0;$pos<$maxTodo;$pos++) {
        my $name = $text->words(int(rand(3)));
        my $maintainId=int(rand($maxMaintainId));
	my $desc = $text->paragraphs(1);
	my $sts  ="active";
	my $complete ="false";
	my $createdAt = "2019-01-17";

my $line = <<"END_LINE";
insert into todo (id,name,maintainID,description,status,complete,createdAt) 
values(
    $pos,
    '$name',
    $maintainId,
    '$desc',
    '$sts',
    '$complete',
    '$createdAt'
);
END_LINE

	push(@arr,$line);
    }

    return @arr;
}

  
sub fillPart {
    my $maxParts=45;
    my @arr;
    my $maxMaintainId=scalar(@maintain);

    for(my $pos=0;$pos<$maxParts;$pos++) {
        my $name = $text->words(int(rand(3)));
        my $maintainId=int(rand($maxMaintainId));
	my $desc = $text->paragraphs(1);
	my $price=sprintf("%.2f",rand(25.00));
	my $vendor=$text->words(int(rand(2)));
	my $sts  ="active";
	my $complete ="false";
	my $createdAt = "2019-01-17";

my $line = <<"END_LINE";
insert into part (id,name,maintainID,description,price,vendor,status,complete,createdAt) 
values(
    $pos,
    '$name',
    $maintainId,
    '$desc',
    $price,
    '$vendor',
    '$sts',
    '$complete',
    '$createdAt'
);
END_LINE

	push(@arr,$line);
    } 
    return @arr;
}

sub fillNote {
    my $maxNotes=22;
    my @arr;
    my $maxMaintainId=scalar(@maintain);

    for(my $pos=0;$pos<$maxNotes;$pos++) {
        my $name = $text->words(int(rand(3)));
        my $maintainId=int(rand($maxMaintainId));
	my $desc = $text->paragraphs(1);
	my $sts  ="active";
	my $complete ="false";
	my $createdAt = "2019-01-17";

my $line = <<"END_LINE";
insert into part (id,name,maintainID,description,status,complete,createdAt) 
values(
    $pos,
    '$name',
    $maintainId,
    '$desc',
    '$sts',
    '$complete',
    '$createdAt'
);
END_LINE

	push(@arr,$line);
    } 
 
    return @arr;
}
# -------------------------------------------------
# main
# -------------------------------------------------

print "Hey Mark! Long time no see!\n";

#print "meta: ",$meta->name(),"\n";

@maintain = fillMaintain();
@todo     = fillTodo();
@part     = fillPart();
@note     = fillNote();

#print Dumper(\@maintain);
print @maintain;
print @todo;
print @part;
print @note;

__END__


