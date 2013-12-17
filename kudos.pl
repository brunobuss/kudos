package Model;
use strict;
use ORLite {
    file    => 'kudos.db',
    unicode => 1,
    create  => sub {
        my $dbh = shift;
        $dbh->do(q{
            CREATE TABLE kudos (
                id INTEGER PRIMARY KEY,
                person INTEGER NOT NULL,
                reason TEXT NOT NULL,
                votes  INTEGER NOT NULL,
                date   TEXT NOT NULL
            )}
        );
 
        $dbh->do(q{
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            )}
        );

        $dbh->do(q{
            INSERT INTO users (name)
            VALUES  ('Bruno C. Buss'), 
                    ('Sir Arthur'),
                    ('Luke Skywalker')
            }
        );

        # just use $dbh->do(...) if you need more
        # tables
        return 1;
      }
};
     
package main;
use Mojolicious::Lite;
use Mojo::JSON;

use Scalar::Util qw{ looks_like_number };

get '/' => sub {
    my $self = shift;

    $self->render_static('index.html');
};

get '/kudos' => sub {
    my $self = shift;

    my $user_id_to_name = {
        map { $_->{id} => $_->{name} } Model::Users->select('')
    };

    my $content = [ map {
            {
                id     => $_->{id},
                person => $user_id_to_name->{$_->{person}},
                reason => $_->{reason},
                date   => $_->{date},
            }
        } Model::Kudos->select('ORDER BY id DESC LIMIT 100') ];

    $self->render( json => $content );
};

get '/kudos/:user' => sub {
    my $self = shift;
    my $user  = $self->stash('user');

    my $user_id_to_name = {
        map { $_->{id} => $_->{name} } Model::Users->select('')
    };

    my $content = [];

    if( looks_like_number($user) ) {
        my $content = [ map {
            {
                id     => $_->{id},
                person => $user_id_to_name->{$_->{person}},
                reason => $_->{reason},
                date   => $_->{date},
            }
        } Model::Kudos->select('WHERE person = ? ORDER BY id DESC LIMIT 100', $user) ];
    }
    elsif( $user ne '' ) {
        my $user_ids = [ map { $_->{id} } Model::Users->select(q{WHERE users.name like '%?%'}, $user ) ];
        my $ph = join ', ' => map { '?' } @$user_ids;

        my $content = [ map {
            {
                id     => $_->{id},
                person => $user_id_to_name->{$_->{person}},
                reason => $_->{reason},
                date   => $_->{date},
            }
        } Model::Kudos->select("WHERE person in ($ph) ORDER BY id DESC LIMIT 100", @$user_ids) ];
    }

    $self->render( json => $content );
};

post '/kudos' => sub {
    my $self = shift;

    my $content = $self->tx->req->content->get_body_chunk(0);
    my $new_kudo = Mojo::JSON->new->decode( $content );

    my $user_id;
    if( !Model::Users->count('where name = ?', $new_kudo->{person}) ) {
        my $user = Model::Users->create( name => $new_kudo->{person} );
        $user_id = $user->id;
    }
    else {
        my $user = Mode::Users->select('where name = ?', $new_kudo->{person});
        $user_id = $user->[0]->id;
    }

    $new_kudo->{person} = $user_id;
    $new_kudo->{votes}  = 1;
    Model::Kudos->create( %$new_kudo );

    $self->render( json => $content );
};

post '/kudos_up' => sub {
    my $self = shift;

    my $content = $self->tx->req->content->get_body_chunk(0);
    my $kudos_up = Mojo::JSON->new->decode( $content );

    Model->do(q{
        UPDATE kudos
        SET    votes = votes + 1
        WHERE  id = ?
        },
        undef,
        $kudos_up->{id},
    );

    $self->render( json => $content );
};

options '/kudos' => sub {
    my $self = shift;

    $self->render( json => [ 'GET', 'POST' ] );
};

get '/users' => sub {
    my $self = shift;

    my $content = [ { name => map { $_->{name} } Model::Users->select('ORDER BY name') } ];
    $self->render( json => $content );
};

options '/users' => sub {
    my $self = shift;

    $self->render( json => [ 'GET' ] );
};

app->start;
